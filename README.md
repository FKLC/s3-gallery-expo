# S3 Gallery Expo
This is a React Native / Expo app that allows you to upload your photos to any S3 compatible storage provider. The app works, but the codebase turned out to be a huge mess. I failed implementing proper state management and ended up with a spaghetti code. So, I gave up on this project as I will never release this app. Just publishing it for the others to use.

### Implementation
1. First you enter your bucket information. Your config has to be a valid [S3ClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-s3/Interface/S3ClientConfig/) e.g. `new S3Client(<YOUR CONFIG WILL BE USED HERE>)`. The app comes with a client config generator for Cloudflare R2.
1. You select the album you want to backup.
1. Click on sync button at the top of the page, and select your target bucket.
1. The app will start uploading your photos while the app is open. I thought about implementing background tasks, but I gave up on this project as a whole.
