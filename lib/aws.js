const {
    EC2Client,
    DescribeImagesCommand,
    DescribeInstancesCommand,
    DescribeLaunchTemplateVersionsCommand
} = require("@aws-sdk/client-ec2");

const {
    AutoScalingClient,
    DescribeLaunchConfigurationsCommand
} = require("@aws-sdk/client-auto-scaling");

const config = {};
const ec2Client = new EC2Client(config);
const asClient = new AutoScalingClient(config);

const getAmiDates = async (amis) => {
    const command = new DescribeImagesCommand({
        "ImageIds": amis,
        "IncludeDeprecated": true
    });
    const response = await ec2Client.send(command);
    return response.Images.reduce((o, img) => {
        const {ImageId, DeprecationTime, CreationDate} = img;
        o[ImageId] = {DeprecationTime, CreationDate};
        return o;
    }, {})
}

const getAmis = async () => {
    const promises = [
        getInstanceAmis(),
        getLaunchTemplateAmis(),
        getLaunchConfigAmis()
    ];
    return merge(...(await Promise.all(promises)));
}

const merge = (...objects) => {
    const combined = {};
    for (const item of objects) {
        for (key in item) {
            if (key in combined) {
                combined[key] = [...combined[key], ...item[key]];
            } else {
                combined[key] = item[key];
            }
        }
    }
    return combined;
}

const getInstanceAmis = async (amis = {}, token) => {
    const command = new DescribeInstancesCommand({
        NextToken: token,
        MaxResults: 1000
    });
    response = await ec2Client.send(command);
    for (const res of response.Reservations) {
        res.Instances.reduce((acc, instance) => {
            const {ImageId, InstanceId} = instance;
            acc[ImageId] ||= [];
            acc[ImageId].push(`instance ${InstanceId}`);
            return acc;
        }, amis);
    }
    if (response.NextToken) {
        return getInstanceAmis(amis, response.NextToken);
    } else {
        return amis;
    }
}

const getLaunchTemplateAmis = async (amis = {}, token) => {
    const command = new DescribeLaunchTemplateVersionsCommand({
        Versions: ['$Latest'],
        NextToken: token,
    });
    const response = await ec2Client.send(command);
    response.LaunchTemplateVersions.reduce((acc, ltv) => {
        const {LaunchTemplateId, LaunchTemplateData, VersionNumber} = ltv;
        const {ImageId} = LaunchTemplateData;
        acc[ImageId] ||= [];
        acc[ImageId].push(`launch template ${LaunchTemplateId} v${VersionNumber}`)
        acc
    }, amis);
    if (response.NextToken) {
        return getLaunchTemplateAmis(amis, response.NextToken);
    } else {
        return amis;
    }
};

const getLaunchConfigAmis = async (amis = {}, token) => {
    const command = new DescribeLaunchConfigurationsCommand({
        MaxRecords: 100,
        NextToken: token,
    });
    const response = await asClient.send(command);
    response.LaunchConfigurations.reduce((acc, lc) => {
        const {ImageId, LaunchConfigurationName} = lc;
        acc[ImageId] ||= [];
        acc[ImageId].push(`launch config ${LaunchConfigurationName}`)
        acc
    }, amis);
    if (response.NextToken) {
        return getLaunchConfigAmis(amis, response.NextToken);
    } else {
        return amis;
    }
};

module.exports = {
    getAmiDates,
    getAmis
}