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

import { listshowAction } from "./show";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("scorecard/goal/rule/show.ts", () => {
    let validateGroupIdMock: SinonStub<unknown[], unknown>;
    let validateScorecardIdMock: SinonStub<unknown[], unknown>;
    let validateScorecardGoalIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const oneOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const twoOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const allOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        G: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGroupIdMock = ImportMock.mockFunction(parameters, "validateGroupId");
        validateScorecardIdMock = ImportMock.mockFunction(parameters, "validateScorecardId");
        validateScorecardGoalIdMock = ImportMock.mockFunction(parameters, "validateScorecardGoalId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGroupIdMock.restore();
        validateScorecardIdMock.restore();
        validateScorecardGoalIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("listshowAction()", () => {
        it("list with --help", (done) => {
            validateGroupIdMock.resolves(undefined);
            validateScorecardIdMock.resolves(undefined);
            validateScorecardGoalIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => helpOptions,
            };
            listshowAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGroupIdMock.callCount).to.equal(0);
                expect(validateScorecardIdMock.callCount).to.equal(0);
                expect(validateScorecardGoalIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("list with no options", (done) => {
            validateGroupIdMock.resolves(undefined);
            validateScorecardIdMock.rejects();
            validateScorecardGoalIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => emptyOptions,
            };
            listshowAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(1);
                expect(validateScorecardGoalIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("list with one options", (done) => {
            validateGroupIdMock.resolves(oneOptions.W);
            validateScorecardIdMock.rejects();
            validateScorecardGoalIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => oneOptions,
            };
            listshowAction(oneOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(1);
                expect(validateScorecardGoalIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("list with two options", (done) => {
            validateGroupIdMock.resolves(twoOptions.W);
            validateScorecardIdMock.resolves(twoOptions.S);
            validateScorecardGoalIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => twoOptions,
            };
            listshowAction(twoOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(1);
                expect(validateScorecardGoalIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("list with all options", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateScorecardIdMock.resolves(allOptions.S);
            validateScorecardGoalIdMock.resolves(allOptions.G);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => allOptions,
            };
            listshowAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(1);
                expect(validateScorecardGoalIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("show with no options", (done) => {
            validateGroupIdMock.rejects();
            validateScorecardIdMock.rejects();
            validateScorecardGoalIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => emptyOptions,
            };
            listshowAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(0);
                expect(validateScorecardGoalIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with one options", (done) => {
            validateGroupIdMock.resolves(oneOptions.W);
            validateScorecardIdMock.rejects();
            validateScorecardGoalIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => oneOptions,
            };
            listshowAction(oneOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(1);
                expect(validateScorecardGoalIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with two options", (done) => {
            validateGroupIdMock.resolves(twoOptions.W);
            validateScorecardIdMock.resolves(twoOptions.S);
            validateScorecardGoalIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => twoOptions,
            };
            listshowAction(twoOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(1);
                expect(validateScorecardGoalIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with all options", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateScorecardIdMock.resolves(allOptions.S);
            validateScorecardGoalIdMock.resolves(allOptions.G);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => allOptions,
            };
            listshowAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(1);
                expect(validateScorecardGoalIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
