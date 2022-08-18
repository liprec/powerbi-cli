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

import { ModuleCommand } from "../../../lib/command";
import { createAction } from "./create";
import { deleteAction } from "./delete";
import { updateAction } from "./update";
import { listshowAction, expandGoalValue } from "./listshow";
import { getCommands as getNoteCommands } from "./note";

export function getCommands(): ModuleCommand {
    const createCommand = new ModuleCommand("create")
        .description("Creates a new goal value check-in")
        .action(createAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal")
        .option(
            "--definition <definition>",
            "String with the goal definition in JSON format. Use @{file} to load from a file"
        );
    createCommand.addGlobalOptions();
    const deleteCommand = new ModuleCommand("delete")
        .description("Deletes a goal value check-in")
        .action(deleteAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal")
        .option("--timestamp <timestamp>", "The timestamp for the value of the goal");
    deleteCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .action(listshowAction)
        .description("List the goal value check-ins")
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal");
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Show a goal value check-ins")
        .action(listshowAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal")
        .option("--timestamp <timestamp>", "The timestamp for the value of the goal")
        .option(
            "--expand <entity>",
            `Expands related entities inline, receives a comma-separated list of data types. Allowed values: ${expandGoalValue.join(
                ", "
            )}`
        );
    showCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Updates a goal value check-in")
        .action(updateAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal")
        .option("--timestamp <timestamp>", "The timestamp for the value of the goal")
        .option(
            "--definition <definition>",
            "String with the goal definition in JSON format. Use @{file} to load from a file"
        );
    updateCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("value")
        .description("Operations for working with scorecard goal value check-ins")
        .addCommand(createCommand)
        .addCommand(deleteCommand)
        .addCommand(listCommand)
        .addCommand(showCommand)
        .addCommand(updateCommand)
        .addCommand(getNoteCommands());
    appCommand.addGlobalOptions();
    return appCommand;
}
