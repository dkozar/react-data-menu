var context = require.context('./tests', true, /-test\.jsx?$/);
context.keys().forEach(context);