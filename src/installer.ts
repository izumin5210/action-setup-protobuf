import * as core from '@actions/core';
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
}

async function download(version: string): Promise<string> {
  const archivePath = await tc.downloadTool(getUrl(version));
  const extractedPath = await tc.extractZip(archivePath);
  const toolPath = path.join(extractedPath, getArchiveName(version));
  const cachePath = await tc.cacheDir(toolPath, "protobuf", version);
  core.debug(`goxz is cached under ${cachePath}`);
  return cachePath;
}

function getUrl(version: string): string {
  return `https://github.com/protocolbuffers/protobuf/releases/download/v${version}/${getArchiveName(version)}.zip`;
}

function getArchiveName(version: string): string {
  return `protoc-${version}-linux-x86_64`;
}
