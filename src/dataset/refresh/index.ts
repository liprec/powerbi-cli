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

import { ModuleCommand } from "../../lib/command";
import { cancelAction } from "./cancel";
import { detailAction } from "./detail";
import { showAction } from "./show";
import { historyAction } from "./listhistory";
import { updateAction } from "./update";
import { startAction } from "./start";
import { refreshNotify } from "../../lib/helpers";

export function getCommands(): ModuleCommand {
    const cancelCommand = new ModuleCommand("cancel")
        .description("Cancels the refresh operation for the specified Power BI dataset")
        .action(cancelAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset")
        .option("--refresh -r <refresh>", "ID of the refresh id");
    cancelCommand.addGlobalOptions();
    const detailCommand = new ModuleCommand("detail")
        .description("Returns execution details of the refresh operation for the specified Power BI dataset")
        .action(detailAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset")
        .option("--refresh -r <refresh>", "ID of the refresh id");
    detailCommand.addGlobalOptions();
    const historyCommand = new ModuleCommand("history")
        .description("Get the history of a Power BI refresh schedule")
        .action(historyAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset");
    historyCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Update a Power BI refresh schedule")
        .action(updateAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset")
        .option(
            "--refresh-schedule <data>",
            "String with the refresh schedule in JSON format. Use @{file} to load from a file"
        )
        .option(
            "--refresh-schedule-file <file>",
            "File with the refresh schedule in JSON format. Deprecated: use --refresh-schedule @{file}"
        )
        .option("--direct-query", "Dataset is a direct query or live connection");
    updateCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI refresh schedule")
        .action(showAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset")
        .option("--direct-query", "Dataset is a direct query or live connection");
    showCommand.addGlobalOptions();
    const startCommand = new ModuleCommand("start")
        .description("Triggers a Power BI dataset refresh ")
        .action(startAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset")
        .option("--notify <option>", `Allowed values: ${refreshNotify.join(", ")}`);
    startCommand.addGlobalOptions();
    const datassetCommand = new ModuleCommand("refresh")
        .description("Operations for working with refresh schedule")
        .addCommand(cancelCommand)
        .addCommand(detailCommand)
        .addCommand(historyCommand)
        .addCommand(updateCommand)
        .addCommand(showCommand)
        .addCommand(startCommand);
    datassetCommand.addGlobalOptions();
    return datassetCommand;
}
