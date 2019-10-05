import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import * as fs from 'fs';
import * as path from 'path';

export async function installProtobuf(version: string): Promise<void> {
  const toolPath = tc.find('protobuf', version) || await download(version);
  core.debug(`contained entries: ${fs.readdirSync(toolPath)}`);
  const dest = path.join('/usr', 'local');
  io.cp(path.join(toolPath, 'bin', '*'), path.join(dest, 'bin'));
  io.cp(path.join(toolPath, 'include', '*'), path.join(dest, 'include'));

  await exec.exec('protoc', ['--version']);
}

async function download(version: string): Promise<string> {
  const url = getUrl(version);
  core.debug(`Downloading: ${url}`);
  const archivePath = await tc.downloadTool(getUrl(version));
  core.debug(`Extracting: ${archivePath}`);
  const extractedPath = await tc.extractZip(archivePath);
  core.debug(`Extracted: ${extractedPath}\n${fs.readdirSync(extractedPath)}`);
  const cachePath = await tc.cacheDir(extractedPath, "protoc", version);
  core.debug(`goxz is cached under ${cachePath}`);
  return cachePath;
}

function getUrl(version: string): string {
  return `https://github.com/protocolbuffers/protobuf/releases/download/${version}/${getArchiveName(version)}.zip`;
}

function getArchiveName(version: string): string {
  return `protoc-${version.replace(/^v/, '')}-linux-x86_64`;
}
