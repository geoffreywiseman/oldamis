# Old AMIs
A simple JavaScript CLI tool to:
* determine which AMIs are in use in your AWS account
  * looking at: instances, launch configurations, launch templates
  * using normal AWS credential sources
* check if any of those AMIs are:
  * old (>1y since creation)
  * deprecated (`DeprecationTime` in the past)
  * see: [Amazon EC2 adds new AMI property to flag outdated AMIs](https://aws.amazon.com/about-aws/whats-new/2021/06/amazon-ec2-adds-new-ami-property-to-flag-outdated-amis/)

# Example
This is an example of what `oldamis` looks like in actual use:

```
❯ npx @codiform/oldamis
   ___    _       _        _      __  __   ___
  / _ \  | |   __| |      / \    |  \/  | |_ _|  ___
 | | | | | |  / _` |     / _ \   | |\/| |  | |  / __|
 | |_| | | | | (_| |    / ___ \  | |  | |  | |  \__ \
  \___/  |_|  \__,_|   /_/   \_\ |_|  |_| |___| |___/

ami ami-730ebd17 is old (created 2016-08-22T19:58:21.000-04:00), sources:
  - instance i-13e13eeb963a78ab9
ami ami-0cde1f5ee149df291 is ok, sources:
  - instance i-a3c31bb5ebbd4790d
  - instance i-11aff774c13d785ef
  - instance i-486d7a5e0171e6749
ami ami-0f1c5116668d961c3 is ok, sources:
  - instance i-8f434ca2c2c36dfb5
  - instance i-4b344522536719e4f
  - launch config demo-launch-config-2340234
```

# Privacy
Although `oldamis` needs to use your credentials to access your AWS environment it:
- will not store / transmit any information about your account
- does not require any more than read-only permissions
- is relatively simple and open-source, so you can look it over to make sure it's not malicious
