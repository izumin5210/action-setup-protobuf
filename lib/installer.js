"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const io = __importStar(require("@actions/io"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function installProtobuf(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const toolPath = tc.find('protobuf', version) || (yield download(version));
        core.debug(`contained entries: ${fs.readdirSync(toolPath)}`);
        const dest = path.join('/usr', 'local');
        io.cp(path.join(toolPath, 'bin', '*'), path.join(dest, 'bin'));
        io.cp(path.join(toolPath, 'include', '*'), path.join(dest, 'include'));
    });
}
exports.installProtobuf = installProtobuf;
function download(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = getUrl(version);
        core.debug(`Downloading: ${url}`);
        const archivePath = yield tc.downloadTool(getUrl(version));
        core.debug(`Extracting: ${archivePath}`);
        const extractedPath = yield tc.extractZip(archivePath);
        core.debug(`Extracted: ${extractedPath}\n${fs.readdirSync(extractedPath)}`);
        const toolPath = path.join(extractedPath, getArchiveName(version));
        const cachePath = yield tc.cacheDir(toolPath, "protobuf", version);
        core.debug(`goxz is cached under ${cachePath}`);
        return cachePath;
    });
}
function getUrl(version) {
    return `https://github.com/protocolbuffers/protobuf/releases/download/${version}/${getArchiveName(version)}.zip`;
}
function getArchiveName(version) {
    return `protoc-${version.replace(/^v/, '')}-linux-x86_64`;
}
