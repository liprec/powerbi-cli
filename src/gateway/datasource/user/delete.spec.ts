/*
 * Copyright (c) 2020 Jan Pieter Posthuma / DataScenarios
 *
 * All rights reserved.
 *
 * MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { ImportMock } from "ts-mock-imports";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import { SinonStub } from "sinon";

import { ModuleCommand } from "../../../lib/command";
import * as parameters from "../../../lib/parameters";
import * as api from "../../../lib/api";

import { deleteAction } from "./delete";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("gateway/datasource/delete.ts", () => {
    let validateGatewayIdMock: SinonStub<unknown[], unknown>;
    let validateGatewayDatasourceIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingOptions = {
        G: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        D: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const emailTypeOptions = {
        G: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        D: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        email: "joe@doe.com",
    };
    const identifierOptions = {
        G: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        D: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        identifier: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGatewayIdMock = ImportMock.mockFunction(parameters, "validateGatewayId");
        validateGatewayDatasourceIdMock = ImportMock.mockFunction(parameters, "validateGatewayDatasourceId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGatewayIdMock.restore();
        validateGatewayDatasourceIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("deleteAction()", () => {
        it("delete with --help", (done) => {
            validateGatewayDatasourceIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "delete",
                opts: () => helpOptions,
            };
            deleteAction(cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGatewayIdMock.callCount).to.equal(0);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("delete with no options", (done) => {
            validateGatewayIdMock.rejects();
            validateGatewayDatasourceIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "delete",
                opts: () => emptyOptions,
            };
            deleteAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("delete with missing options", (done) => {
            validateGatewayIdMock.resolves(missingOptions.G);
            validateGatewayDatasourceIdMock.rejects(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "delete",
                opts: () => missingOptions,
            };
            deleteAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("delete with email options", (done) => {
            validateGatewayIdMock.resolves(emailTypeOptions.G);
            validateGatewayDatasourceIdMock.resolves(emailTypeOptions.D);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "delete",
                opts: () => emailTypeOptions,
            };
            deleteAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("delete with idenifier options", (done) => {
            validateGatewayIdMock.resolves(identifierOptions.G);
            validateGatewayDatasourceIdMock.resolves(identifierOptions.D);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "delete",
                opts: () => identifierOptions,
            };
            deleteAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
