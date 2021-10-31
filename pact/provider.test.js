import { Verifier } from "@pact-foundation/pact";
import childProcess from"child_process";
import {jest} from '@jest/globals';
import runServer from "../server";

// Increase timeout to 20 seconds so the server has time to startup within the test
jest.setTimeout(30000)

describe("Pact Verification", () => {
  let server;

  beforeAll(() => {
    server = runServer(true);
  });

  afterAll(() => {
    server.close();
  });

  it("Validates the expectations of the UI", (done) => {
    const gitHash = childProcess.execSync("git rev-parse --short HEAD").toString().trim();
    const opts = {
      provider: "Brilliant Banking Server Devoxx",
      logLevel: "info",
      providerBaseUrl: "http://localhost:8080",
      pactBrokerUrl: process.env.PACT_BROKER_URL,
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      publishVerificationResult: true,
      providerVersion: gitHash
    }

    // Perform the verification
    new Verifier(opts).verifyProvider().then(output => {
      console.log(output)
      done();
    }, err => {
      // Jest shows the error and fails the test
      expect(err).toBeNull();
      done();
    });
  });
});