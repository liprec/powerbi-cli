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

import { checkUUID } from "./validate";
import {
    getGroupID,
    getDatasetID,
    getAppID,
    getCapacityID,
    getDashboardID,
    getDashboardTileID,
    getDataflowID,
    getReportID,
    getGatewayID,
    getGatewayDatasourceID,
    getImportID,
    getAdminGroupInfo,
    getAdminCapacityID,
    getAdminObjectInfo,
    getScorecardID,
    getScorecardGoalID,
    getPipelineID,
} from "./helpers";
import { getDefault } from "./config";

export interface Parameter {
    name?: string;
    isId?: () => Promise<string>;
    isName?: () => Promise<string>;
    validate?: () => Promise<string>;
    missing: string;
    isRequired: boolean;
}

export async function validateGroupId(group: string | undefined, isRequired: boolean): Promise<string | undefined> {
    if (!group) group = getDefault("workspace");
    return validateParameter({
        name: group,
        isName: () => getGroupID(group as string),
        missing: "error: missing option '--workspace'",
        isRequired,
    });
}

export async function validateAdminGroupId(
    group: string | undefined,
    isRequired: boolean,
    filterState: string | undefined = undefined
): Promise<string | undefined> {
    if (!group) group = getDefault("workspace");
    return validateParameter({
        name: group,
        isName: () => getAdminGroupInfo(group as string, filterState).then((result) => Promise.resolve(result[0])),
        isId: () => getAdminGroupInfo(group as string, filterState).then((result) => Promise.resolve(result[1])),
        missing: "error: missing option '--workspace'",
        isRequired,
    });
}

export async function validateAdminObjectId(
    objectName: string | undefined,
    isRequired: boolean,
    objectType: string,
    lookupName: string,
    returnName: string | undefined = "id"
): Promise<string | undefined> {
    return validateParameter({
        name: objectName,
        isName: () => getAdminObjectInfo(objectName as string, `${objectType}s`, lookupName, returnName),
        missing: `error: missing option '--${objectType}'`,
        isRequired,
    });
}

export async function validateAdminCapacityId(
    capacity: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: capacity,
        isName: () => getAdminCapacityID(capacity as string),
        missing: "error: missing option '--capacity'",
        isRequired,
    });
}

export async function validateCapacityId(
    capacity: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: capacity,
        isName: () => getCapacityID(capacity as string),
        missing: "error: missing option '--capacity'",
        isRequired,
    });
}

export async function validateDataflowId(
    groupId: string,
    dataflow: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: dataflow,
        isName: () => getDataflowID(groupId, dataflow as string),
        missing: "error: missing option '--dataflow'",
        isRequired,
    });
}

export async function validateDatasetId(
    groupId: string | undefined,
    dataset: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: dataset,
        isName: () => getDatasetID(groupId, dataset as string),
        missing: "error: missing option '--dataset'",
        isRequired,
    });
}

export async function validateReportId(
    groupId: string | undefined,
    report: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: report,
        isName: () => getReportID(groupId, report as string),
        missing: "error: missing option '--report'",
        isRequired,
    });
}

export async function validateDashboardId(
    groupId: string | undefined,
    dashboard: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    if (!dashboard) dashboard = getDefault("dashboard");
    return validateParameter({
        name: dashboard,
        isName: () => getDashboardID(groupId, dashboard as string),
        missing: "error: missing option '--dashboard'",
        isRequired,
    });
}

export async function validateDashboardTileId(
    groupId: string | undefined,
    dashboard: string | undefined,
    tile: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: tile,
        isName: () => getDashboardTileID(groupId, dashboard as string, tile as string),
        missing: "error: missing option '--tile'",
        isRequired,
    });
}

export async function validateAppId(app: string | undefined, isRequired: boolean): Promise<string | undefined> {
    return validateParameter({
        name: app,
        isName: () => getAppID(app as string),
        missing: "error: missing option '--app'",
        isRequired,
    });
}

export async function validateImportId(
    groupId: string | undefined,
    name: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: name,
        isName: () => getImportID(groupId, name as string),
        missing: "error: missing option '--import'",
        isRequired,
    });
}

export async function validateGatewayId(gateway: string | undefined, isRequired: boolean): Promise<string | undefined> {
    if (!gateway) gateway = getDefault("gateway");
    return validateParameter({
        name: gateway,
        isName: () => getGatewayID(gateway as string),
        missing: "error: missing option '--gateway'",
        isRequired,
    });
}

export async function validateGatewayDatasourceId(
    gateway: string,
    datasource: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: datasource,
        isName: () => getGatewayDatasourceID(gateway, datasource as string),
        missing: "error: missing option '--datasource'",
        isRequired,
    });
}

export async function validateScorecardId(
    groupId: string | undefined,
    scorecard: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    if (!scorecard) scorecard = getDefault("scorecard");
    return validateParameter({
        name: scorecard,
        isName: () => getScorecardID(groupId, scorecard as string),
        missing: "error: missing option '--scorecard'",
        isRequired,
    });
}

export async function validateScorecardGoalId(
    groupId: string | undefined,
    scorecard: string | undefined,
    goal: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: goal,
        isName: () => getScorecardGoalID(groupId, scorecard as string, goal as string),
        missing: "error: missing option '--goal'",
        isRequired,
    });
}

export async function validatePipelineId(
    pipeline: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    if (!pipeline) pipeline = getDefault("pipeline");
    return validateParameter({
        name: pipeline,
        isName: () => getPipelineID(pipeline as string),
        missing: "error: missing option '--pipeline'",
        isRequired,
    });
}

export async function validateSubscriptionId(
    subscription: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    if (!subscription) subscription = getDefault("subscription");
    return validateParameter({
        name: subscription,
        isName: () => Promise.reject("error: '--subscription' should be a unique identifier"),
        missing: "error: missing option '--subscription'",
        isRequired,
    });
}

export async function validateResourceGroupId(
    resourceGroup: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    if (!resourceGroup) resourceGroup = getDefault("resourceGroup");
    return validateParameter({
        name: resourceGroup,
        isId: () => Promise.reject("error: '--resource' should be a name"),
        missing: "error: missing option '--resource'",
        isRequired,
    });
}

export async function validateParameter(parameter: Parameter): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve, reject) => {
        if (!parameter.name && parameter.isRequired) {
            reject(parameter.missing);
        }
        if (parameter.name) {
            if (checkUUID(parameter.name)) {
                if (parameter.isId) {
                    parameter
                        .isId()
                        .then((result: string) => resolve(result))
                        .catch((err: string) => reject(err));
                } else {
                    resolve(parameter.name);
                }
            } else {
                if (parameter.isName) {
                    parameter
                        .isName()
                        .then((result: string) => resolve(result))
                        .catch((err: string) => reject(err));
                } else {
                    resolve(parameter.name);
                }
            }
        } else {
            resolve(undefined);
        }
    });
}

export function validateAllowedValues(value: string, allowedValues: string[], multiSelect = false): Promise<string> {
    return new Promise((resolve, reject) => {
        if (multiSelect) {
            const values = value.split(",");
            if (
                values.length ===
                values.filter(
                    (value: string) =>
                        allowedValues
                            .map((allowedValue) => allowedValue.toLocaleLowerCase())
                            .indexOf(value.trim().toLocaleLowerCase()) > -1
                ).length
            ) {
                resolve(value);
            } else {
                reject(
                    `error: at least one incorrect option in '${value}'. Allowed values: ${allowedValues.join(", ")}`
                );
            }
        } else {
            if (
                allowedValues.some(
                    (allowedValue: string) => allowedValue.toLocaleLowerCase() === value.toLocaleLowerCase()
                )
            ) {
                resolve(value);
            } else {
                reject(`error: incorrect option '${value}'. Allowed values: ${allowedValues.join(", ")}`);
            }
        }
    });
}

export function validateStartValues(value: string, startString: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (value.startsWith(startString)) {
            resolve(value);
        } else {
            reject(`error: '${value}' needs to start with ${startString}`);
        }
    });
}

export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
