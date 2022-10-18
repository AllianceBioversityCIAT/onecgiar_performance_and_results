import request from 'supertest';

describe('Role by User Controller (e2e)', () => {
    let app = 'http://localhost:3400'
    let token: string;

    // * Successfull login test & obtaine the token
    it('/auth/singin (POST)', async () => {
        const createUser = await request(app)
            .post('/auth/singin')
            .send({
                'email': 'juan@gmail.com',
                'password': '1234567'
            })
            .set('Content-Type', 'application/json')
            .expect(202)

        console.log('Successfully login to take the token', createUser.body.response.token);
        token = createUser.body.response.token;
    });

    // * Successfully fetch role by user ID
    it('/auth/role-by-user/get/user/<id> (GET)', async () => {
        return await request(app)
            .get('/auth/role-by-user/get/user/' + 1)
            .set('Content-Type', 'application/json')
            .set('auth', token)
            .expect(200)
            .expect(res => {
                console.log('Successfully fetch role by user ID:', res.text)
            });
    });
});