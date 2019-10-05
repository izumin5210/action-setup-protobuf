import * as core from '@actions/core';
import { installProtobuf } from './installer'

async function run() {
  try {
    await installProtobuf(core.getInput("version"));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
