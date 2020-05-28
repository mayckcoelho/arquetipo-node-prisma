const supertest = require('supertest');
const app = require('../../src/server');

const request = supertest(app)

afterEach((done) => {
    return app && app.close(done);
});

describe('should test UserController', () => {
    it("should return 200 in get /users", async done => {
        const response = await request.get('/users')

        expect(response.status).toBe(200)
        done()
    })

    it("", async done => {
        const response = await request.get('/users?limit=teste')

        expect(response.status).toBe(500)
        done()
    })
})

