# aws-sts-assume-role action

GitHub Action to assume a role using STS and output the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables to use in subsequent steps

## Usage

Set the `AWS_ACCSS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets for the User that will assume the role in your Github repo settings.

```yaml
name: CI

on: [push]

jobs:
  test:
    runs-on: ubuntu-18.04

    steps:
      - uses: actions/checkout@v1
      - name: Assume role
        uses: ericallam/aws-sts-assume-role@v1
        id: assume_role
        with:
          accessKeyId: ${{ secrets.AWS_ACCESS_KEY_ID }}
          secretAccessKey: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          roleArn: arn:aws:iam::11111111111:role/my-role
          roleSessionName: ${{ github.sha }}
      - name: Use STS credentials from assume_role
        env:
          AWS_ACCESS_KEY_ID: ${{ steps.assume_role.outputs.stsAccessKeyId }}
          AWS_SECRET_ACCESS_KEY: ${{ steps.assume_role.outputs.stsSecretAccessKey }}
          AWS_SESSION_TOKEN: ${{ steps.assume_role.outputs.stsSessionToken }}
          AWS_DEFAULT_REGION: us-east-1
        run: aws sts get-caller-identity
```

By default, the session is valid for 1 hour.
