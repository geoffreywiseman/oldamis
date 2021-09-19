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
        printDeprecated(ami, dtDeprecation);
    } else if (old) {
        printOld(ami, dtCreation);
    } else {
        printOk(ami);
    }
    printSources(sources)
};

const printDeprecated = (ami, dtDeprecation) => {
    console.log(chalk.redBright(
        `ami ${ami} is deprecated as of ${dtDeprecation}, sources:`
    ));
};

const printOld = (ami, dtCreation) => {
    console.log(chalk.yellowBright(
        `ami ${ami} is old (created ${dtCreation}), sources:`
    ));
};

const printOk = (ami) => {
    console.log(chalk.green(`ami ${ami} is ok, sources:`));
};

const printSources = (sources) => {
    for( const source of sources ) {
        console.log(`  - ${source}`);
    }
}

module.exports = {
    printBanner,
    printAmi
}
