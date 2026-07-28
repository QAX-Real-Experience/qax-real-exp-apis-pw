/**
 * Suite migrada: endpoint de registro (/auth/v1/signup).
 */
import { test, expect } from "@playwright/test";
import { SignupService } from "../../../../src/apis/services/SignupService.js";
import {
  buildValidUser,
  buildUserWithoutPassword,
} from "../../../../src/apis/helpers/userBuilder.js";
import { Logger } from "../../../../src/helpers/logger.js";
import { SignupResponseModel } from "../../../../src/apis/models/signupResponse.js";
import { ErrorSignupResponse } from "../../../../src/apis/models/errorSignupResponse.js";

test.describe(
  "HU - Automatización del Endpoint de Registro (/auth/v1/signup)",
  () => {
    let signupService: SignupService;

    test.beforeEach(async ({ request }) => {
      signupService = new SignupService(request);
    });

    test("Validación del flujo de registro exitoso @smoke", async () => {
      const newUser = buildValidUser();

      const response = await Logger.step("Crear nuevo user", () =>
        signupService.postSignup(newUser)
      );

      const signResponse = new SignupResponseModel(response.body);
      await Logger.step("Validar la respuesta de creación de usuario", async () => {
        expect(response.status).toBe(200);
        expect(signResponse.hasValidId()).toBeTruthy();
        expect(signResponse.hasValidAud()).toBeTruthy();
      });
    });

    test("Validación del status 400 @regression", async () => {
      const newUser = buildUserWithoutPassword();

      const response = await Logger.step("Crear nuevo user sin contraseña", () =>
        signupService.postSignup(newUser)
      );

      const errorResponse = new ErrorSignupResponse(response.body);
      await Logger.step("Validar la respuesta de error", async () => {
        expect(response.status).toBe(400);
        expect(errorResponse.hasErrorMessage()).toBeTruthy();
      });
    });
  }
);