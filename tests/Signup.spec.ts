import { test, expect } from '@playwright/test';
import { signupService } from '../src/services/signupService';
import {userCreate } from '../src/helpers/dataBuilder';
import { Logger } from '../src/helpers/logger';
import { errorSignup } from '../src/models/errorSingupResponse';
import { signup } from '../src/models/signResponse';


test.describe('HU - Automatización del Endpoint de Registro (/auth/v1/signup)',() =>{

    let signService: signupService;

    test.beforeEach(async ({ request }) => {
        signService = new signupService(request);
    });

    test('Validación del flujo de registro exitoso @smoke', async() =>{
        let response: any;
        const newUser = userCreate();

        await Logger.step('Crear nuevo user', async () => {
        response = await signService.postSignup(newUser);
        });
        const signResponse = new signup(response.body);
        await Logger.step('Validar la respuesta de creación de usuario', async () => {
        expect(response.status).toBe(200);
        expect(signResponse.hasValidId()).toBeTruthy();
        expect(signResponse.hasValidAud()).toBeTruthy();
        });
    })

    test('Validación del status 400 @regression', async() =>{
        let response: any;
        const newUser = userCreate();
        newUser.password = '';
        await Logger.step('Crear nuevo user', async () => {
        response = await signService.postSignup(newUser);
        });
        const errorResponse = new errorSignup(response.body);
        await Logger.step('Validar la respuesta de creación de usuario', async () => {
        expect(response.status).toBe(400);
        expect(errorResponse.hasErrorMessage()).toBeTruthy();
        });
    })    
})