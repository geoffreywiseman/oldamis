# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
Minor quality of life improvements to build on the first release.

### Changed
- Altered the output format slightly
  - I found that even on very small accounts the list of sources could get pretty long
  - Looks better with the sources listed one per line

### Fixed
- Improved error handling around CredentialsProviderError.

## [1.0.0] - 2021-09-18
First release of `oldamis`.  I read about the `DeprecationTime` flag 
[introduced](https://aws.amazon.com/about-aws/whats-new/2021/06/amazon-ec2-adds-new-ami-property-to-flag-outdated-amis/) 
in AWS AMI metadata, and thought:
- I wonder if any AMIs I'm using are deprecated?
- Would be nice to have a little tool to answer that question...

And so I wrote one. This release is the MVP of that idea.

### Added
- checks instances, launch configurations and launch templates to see find referenced AMIs
- for each referenced AMI, checks if it is:
  - Created > 1y ago
  - Has a `DeprecationTime` in the past
