# devoirs-core
![TypeScript](https://github.com/approvers/devoirs-core/workflows/TypeScript/badge.svg)
![npm](https://github.com/approvers/devoirs-core/workflows/npm/badge.svg)

Programmatic access to assignments in Microsoft Teams, on Node.js.

## 🚀 Motivation
First, are you really need to use this package?
Usually, the answer is no.
Microsoft provides APIs to access your assignments via Graph, but many of schools or institutes restricts the API access.
When you want to check the assignments to do, you need to launch Microsoft Teams each time.

Using this library, you can access to your assignments even if your school restricts the API access.
Instead of Graph API, we use the OneNote API which is used in Microsoft Teams internally.

Because of the restriction, this library does not support OAuth or something modern authorisation system.
However, thanks to Chromium and Puppeteer, we can automate the authentication through this library.
(I know it is not a great opinion, but it is the only way we can approach.)

## ✨ Features
- Get classes you are taking through Microsoft Teams.
- Get assignments you have to do or have done.

## 💚 Example
Want to know what you can with this library?
See the [example](./example) .

## 📦 Installation
Just type:

```console
$ npm install devoirs-core
```

Easy!

## 🔌 API
To be documented, anyway you can use now!
