#!/usr/bin/env node
const {EC2Client, DescribeImagesCommand} = require("@aws-sdk/client-ec2");
const {getAmiDates, getAmis} = require("./lib/aws");
const {printBanner, printAmi, printError} = require("./lib/display");

(async function () {
    printBanner();
    try {
        const amis = await getAmis();
        const dates = await getAmiDates(Object.keys(amis));
        for (const ami of Object.keys(amis)) {
            printAmi(ami, dates[ami], amis[ami]);
        }
    } catch (err) {
        printError(err);
    }
})();
