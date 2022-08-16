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

import { ModuleCommand } from "../lib/command";
import * as api from "../lib/api";

import { sharedAction } from "./shared";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/shared.ts", () => {
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const tokenOptions = {
        continuationToken: "token",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        executeAPICallMock.restore();
    });
    describe("sharedAction()", () => {
        it("shared with --help", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "shared",
                opts: () => helpOptions,
            };
            sharedAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("shared with no options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "shared",
                opts: () => emptyOptions,
            };
            sharedAction(emptyOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("shared with 'tokenOptions' options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "shared",
                opts: () => tokenOptions,
            };
            sharedAction(tokenOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("continuationToken=token")).to.greaterThan(-1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
