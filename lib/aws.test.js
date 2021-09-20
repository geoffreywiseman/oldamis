const aws = require('./aws');

const {EC2Client, DescribeImagesCommand} = require('@aws-sdk/client-ec2');
const {mockClient} = require('aws-sdk-client-mock');
const ec2Mock = mockClient(EC2Client);

beforeEach(() => {
    ec2Mock.reset();
});

test('gets dates for specified amis', async () => {
    const amis = ['ami-12345'];
    ec2Mock.on(DescribeImagesCommand, {
        ImageIds: amis
    }).resolves({
        Images: [
            {
                ImageId: amis[0],
                DeprecationTime: 'Before Noon on Wednesday',
                CreationDate: 'Dawn of Time'
            }
        ]
    });
    const dates = await aws.getAmiDates(amis);
    expect(Object.keys(dates)).toEqual(amis);
    const imageDates = dates[amis[0]];
    expect(imageDates.DeprecationTime).toBe('Before Noon on Wednesday');
    expect(imageDates.CreationDate).toBe('Dawn of Time');
});
