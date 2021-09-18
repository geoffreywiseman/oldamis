const chalk = require('chalk');
const figlet = require('figlet');
const {DateTime, Interval} = require('luxon');

const printBanner = () => {
    console.log(
        chalk.blueBright(
            figlet.textSync('Old AMIs', {horizontalLayout: 'full'})
        )
    );
};

const printAmi = (ami, dates, sources) => {
    const dtDeprecation = DateTime.fromISO(dates.DeprecationTime);
    const dtCreation = DateTime.fromISO(dates.CreationDate)
    const now = DateTime.now();
    const deprecated = dtDeprecation.isValid && dtDeprecation < now;
    const old = Interval.fromDateTimes(dtCreation, now).length('year') > 1;

    if (deprecated) {
        printDeprecated(ami, dtDeprecation, sources);
    } else if (old) {
        printOld(ami, dtCreation, sources);
    } else {
        printOk(ami, sources);
    }
};

const printDeprecated = (ami, dtDeprecation, sources) => {
    console.log(chalk.redBright(
        `ami ${ami} is deprecated as of ${dtDeprecation} (sources: ${sources})`
    ));
};

const printOld = (ami, dtCreation, sources) => {
    console.log(chalk.yellowBright(
        `ami ${ami} is old (created ${dtCreation}, sources: ${sources})`
    ));
};

const printOk = (ami, sources) => {
    console.log(chalk.green(`ami ${ami} is ok (sources: ${sources})`));
};

module.exports = {
    printBanner,
    printAmi
}
