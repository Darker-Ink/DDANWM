# DarkerInks Discord API & Websocket Mocker

DarkerInks Discord API & Websocket Mocker (or DDANWM for short) is a simple Discord API and WS mocker for testing bots and more.

DDANWM plans to be a simple way to test your bot for production or just to test your bot in general. With simple functions to create and dispatch events, you can test your bot in no time.

DDANWM It requires no database; everything is stored in memory, making it easy to use and setup.

## Notes

- DDANWM is still in development, so expect bugs and more.
- DDANWM is NOT for having a "custom discord instance" or "self-hosted discord", It's for testing bots; do not try to use it for that; it will not work.
  - On top of this, a lot of endpoints will not be implemented; think the login and register endpoints, for example.
  - Though not all endpoints bots should have access to will be implemented right away, if you need an endpoint implemented, make an issue and I'll get to it.
- This project takes GREAT inspiration from [wrangler](https://github.com/cloudflare/workers-sdk)!

### More Technical Notes / Inconsistencies with Discord

Some stuff Discord implements DDANWM may not implement due to limitations (or it being too complicated or a pain to implement). The main thing would probably be `ETF` (External Term Format) for the websocket, which will not be implemented (mainly as I have no clue where to begin with that).

We'll also not be implementing the Voice Gateway, though if you want to take a shot at it, feel free to make a PR!

#### Flags

Flags like the Early Verified Developer, Early Supporter, Moderator Programs Alumni, and Hypesquad events will not be consistent with the user's account age. (i.e., an account can be generated with the Early Supporter flag, but the account is a month old.) Bots shouldn't really care about this, though if yours does for some reason, keep this in mind while testing.

## Contributing

Wanna help out? Great! Just fork the repo, make your changes, and make a pull request. If you have any questions, feel free to join the [Discord Server](https://discord.gg/PmBS6q5gfm) and ask.

Please make sure to read the [Contributing Guidelines](/CONTRIBUTING.md) before contributing.

## Supported API / WS Versions

| Version | Status       | Available | Will Be Worked On |
| ------- | ------------ | --------- | ----------------- |
| 10      | In Progress  |           | Y                 |
| 9       | In Progress  |           | Y                 |
| 8       | Deprecated   |           | N                 |
| 7       | Deprecated   |           | N                 |
| 6       | Deprecated   |           | N                 |
| 5       | Discontinued |           | N                 |
| 4       | Discontinued |           | N                 |
| 3       | Discontinued |           | N                 |
