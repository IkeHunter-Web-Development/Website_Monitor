/**
 * Cron jobs to run on a schedule.
 */
const cron = require("node-cron");
const request = require("request");
const Mailer = require("./emails");
const websiteModel = require("./models");
const CentralEngine = require("./central-engine");

const CRON_SCHEDULE = "*/1 * * * *";
const CRON_UPDATE_SCHEDULE = "*/10 * * * *";
const CRON_UPDATE_DELAY = 15000;

module.exports = class WebsitePing {
    constructor(logger) {
        this.logger = logger;
        this.error_websites = [];
        this.mailer = new Mailer(logger);
        this.jobs = [];
        this.centralEngine = new CentralEngine();
    }

    async getWebsites() {
        const websites = await this.centralEngine.getWebsites();
        // const websites = await websiteModel.find({});
        this.websites = websites;
        let count = websites.length;
        this.logger.info(`Retrieved ${count} websites from the database.`);
        return websites;
    }

    websiteHasError(website) {
        return this.error_websites.includes(website.title);
    }

    getErrorMessage(website, statusCode) {
        return (
            "Website issue detected with " +
            website.title +
            "! Expected: " +
            website.status_code +
            ", received: " +
            statusCode +
            "."
        );
    }

    getSuccessMessage(website, statusCode) {
        return (
            website.title +
            " is operating normally. Status code: " +
            statusCode +
            "."
        );
    }

    getBackOnlineMessage(website, statusCode) {
        return (
            website.title + " is back online. Status code: " + statusCode + "."
        );
    }

    removeErrorWebsite(website) {
        this.error_websites.splice(
            this.error_websites.indexOf(website.title),
            1
        );
    }

    createWebsiteCronJob(website) {
        if (website.active === false) {
            this.logger.verbose(
                "Skipping " + website.title + " because it is inactive."
            );
            return;
        }
        
        let job = cron.schedule(CRON_SCHEDULE, () => {
            request(website.url, (error, response, body) => {
                if (error) {
                    this.logger.error(
                        "Error retrieving " + website.title + ": \n"
                    );
                    this.mailer.sendWebsiteErrorEmail(website, error);
                    console.log(error);
                    return;
                }
                if (response.statusCode !== website.status_code) {
                    let errorMsg = this.getErrorMessage(
                        website,
                        response.statusCode
                    );

                    this.logger.error(errorMsg);
                    console.log("url: " + website.url);
                    this.centralEngine.notify(website.url, response.statusCode, errorMsg);

                    if (this.websiteHasError(website)) {
                        this.logger.verbose(
                            "Already sent email for " + website.title + "."
                        );
                    } else {
                        this.error_websites.push(website.title);
                        this.mailer.sendWebsiteErrorEmail(website, errorMsg);
                    }
                } else {
                    let successMsg = this.getSuccessMessage(
                        website,
                        response.statusCode
                    );

                    if (this.websiteHasError(website)) {
                        let successMsg = this.getBackOnlineMessage(
                            website,
                            response.statusCode
                        );
                        this.removeErrorWebsite(website);
                        this.mailer.sendWebsiteOnlineEmail(
                            website,
                            successMsg
                        );
                        this.logger.info(successMsg);
                        this.centralEngine.notify(website.url, response.statusCode, successMsg);
                    } else {
                        this.logger.verbose(successMsg);
                    }
                }
            });
        });

        this.jobs.push(job);
    }

    pingWebsiteJobs() {
        this.getWebsites().then((websites) => {
            websites.forEach((website) => {
                this.createWebsiteCronJob(website);
            });
        });
    }
    refreshDatabaseJob() {
        cron.schedule(CRON_UPDATE_SCHEDULE, () => {
            setTimeout(() => {
                this.logger.info("Refreshing database...");

                this.jobs.forEach((job) => {
                    job.stop();
                });
                this.jobs = [];

                this.pingWebsiteJobs();
            }, CRON_UPDATE_DELAY);
        });
    }

    setupJobs() {
        console.log("Setting up cron jobs...");
        this.pingWebsiteJobs();
        this.refreshDatabaseJob();
    }
};
