/**
   Copyright (c) 2017 Harbor Platform, Inc.

   Licensed under the Apache License, Version 2.0 (the “License”);
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an “AS IS” BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

module.exports = {
  networks: {
    harbor: {
      host: "localhost",
      port: 22000,
      network_id: "*" // Match any network id
    },
    issuer2: {
      host: "localhost",
      port: 22001,
      network_id: "*" // Match any network id
    },
    issuer3: {
      host: "localhost",
      port: 22002,
      network_id: "*" // Match any network id
    },
    issuer4: {
      host: "localhost",
      port: 22003,
      network_id: "*" // Match any network id
    },
  }
};
