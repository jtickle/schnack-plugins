const TwitterStrategy = require('passport-twitter').Strategy;

module.exports = ({ config, host, app }) => {
    return {
        auth({ providers, passport }) {
            // twitter auth
            providers.push({ id: 'twitter', name: 'Twitter' });
            passport.use(
                new TwitterStrategy(
                    {
                        consumerKey: config.consumer_key,
                        consumerSecret: config.consumer_secret,
                        callbackURL: `${host}/auth/twitter/callback`
                    },
                    (token, tokenSecret, profile, done) => {
                        done(null, profile);
                    }
                )
            );

            app.get('/auth/twitter', passport.authenticate('twitter'));

            app.get(
                '/auth/twitter/callback',
                passport.authenticate('twitter', {
                    failureRedirect: '/login'
                }),
                (request, reply) => {
                    reply.redirect('/success');
                }
            );
            return {
                getAuthorUrl({ name }) {
                    return `https://twitter.com/${name}`;
                }
            };
        }
    };
};
