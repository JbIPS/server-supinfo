const fp = require('fastify-plugin')

module.exports = fp(async (fastify, options) => {
  fastify.decorateRequest('user', null);
  fastify.decorateRequest('password', null);
  const tableUsers = options.tableUsers

  fastify.addHook('preHandler', (request, reply, done) => {
    const authRaw = request.headers.authorization;
    
    if (authRaw) {
      const encodedAuth = authRaw.split(' ').pop();
      const buffer = Buffer.from(encodedAuth, "base64");
      const [authMail, authPass] = buffer.toString("utf-8").split(':');

      if (!tableUsers.some((user) => user.username === authMail && user.password === authPass)) {
        return reply
        .code(403)
          .send(`Forbiden`);
          }else {
        request.user = authMail;
        request.password = authPass;
      }
    }else {
      return reply
            .code(401)
                .header("www-authenticate", "Basic")
                .send(`Unauthorized`);
    }
    done();
  });
})