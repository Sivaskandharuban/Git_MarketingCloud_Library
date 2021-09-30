// module.exports exports the function getContests as a promise and exposes it as a module.
// we can import an exported module by using require().
import axios, { AxiosRequestConfig } from "axios";
const xml2js = require("xml2js");

export default class mcGenericMethods {
  public async getOAuthAccessToken(
    clientId: any,
    clientSecret: any,
    grantType: string,
    code: any,
    redirect_uri: any,
    tssd: any
  ) {
    // Importing the Axios module to make API requests
    let result: any;

    let postBody;
    let headers = {
      "Content-Type": "application/json",
    };

    if (grantType === "client_credentials") {
      postBody = {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      };
    } else if (grantType === "authorization_code") {
      postBody = {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirect_uri,
      };
    }

    let sfmcAuthServiceApiUrl =
      "https://" + tssd + ".auth.marketingcloudapis.com/v2/token";

    await axios // Making a GET request using axios and requesting information from the API
      .post(sfmcAuthServiceApiUrl, postBody, { headers: headers })
      .then((response: any) => {
        // If the GET request is successful, this block is executed
        result = response; // The response of the API call is passed on to the next block
      })
      .catch((err: any) => {
        result = "Error getting access token >>> ";
        result += err; // Error handler
      });
    return result; // The contest data is returned
  } /*+"</CustomerKey>" +

  //Helper method to get refresh token
  /*public async getRefreshToken(
    refreshToken: string,
    tssd: string,
    clientId: any,
    clientSecret: any
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      let sfmcAuthServiceApiUrl =
        "https://" + tssd + ".auth.marketingcloudapis.com/v2/token";
      let headers = {
        "Content-Type": "application/json",
      };
      console.log("sfmcAuthServiceApiUrl:" + sfmcAuthServiceApiUrl);
      let postBody1 = {
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      };
      await axios
        .post(sfmcAuthServiceApiUrl, postBody1, { headers: headers })
        .then((response: any) => {
          const customResponse = {
            refreshToken: response.data.refresh_token,
            oauthToken: response.data.access_token,
          };
          return resolve(customResponse);
        })
        .catch((error: any) => {
          let errorMsg = "Error getting refresh Access Token.";
          errorMsg += "\nMessage: " + error.message;
          errorMsg +=
            "\nStatus: " + error.response ? error.response.status : "<None>";
          errorMsg +=
            "\nResponse data: " + error.response
              ? JSON.stringify(error.response.data)
              : "<None>";
          return reject(errorMsg);
        });
    });
  }

  //To get senderdomainname
  public async getSenderDomain(mcVals: any) {
    let FiltersoapMessage: string;

    if (mcVals.senderProfileID != undefined && mcVals.senderProfileID != "") {
      FiltersoapMessage =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
        "    <s:Header>" +
        '        <a:Action s:mustUnderstand="1">Retrieve</a:Action>' +
        '        <a:To s:mustUnderstand="1">' +
        mcVals.soapInstance +
        "Service.asmx" +
        "</a:To>" +
        '        <fueloauth xmlns="http://exacttarget.com">' +
        mcVals.oauthToken +
        "</fueloauth>" +
        "    </s:Header>" +
        '    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
        '        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">' +
        "            <RetrieveRequest>" +
        "                <ObjectType>SenderProfile</ObjectType>" +
        "      <Properties>ObjectID</Properties>" +
        "        <Properties>Name</Properties>" +
        "        <Properties>CustomerKey</Properties>" +
        '<Filter xsi:type="SimpleFilterPart">' +
        "<Property>ObjectID</Property>" +
        "<SimpleOperator>equals</SimpleOperator>" +
        "<Value>" +
        mcVals.senderProfileID +
        "</Value>" +
        "</Filter>" +
        "            </RetrieveRequest>" +
        "        </RetrieveRequestMsg>" +
        "    </s:Body>" +
        "</s:Envelope>";
    }
    return new Promise<any>(async (resolve, reject) => {
      const configs: AxiosRequestConfig = {
        method: "post",
        url: "" + mcVals.soapInstance + "Service.asmx" + "",
        headers: {
          "Content-Type": "text/xml",
        },
        data: FiltersoapMessage,
      };
      await axios(configs)
        .then(function (response: any) {
          let senderProfileResponse = response.data;
          var senderDomainData = "";
          var parser = new xml2js.Parser();
          parser.parseString(
            senderProfileResponse,
            function (err: any, result: any) {
              senderDomainData =
                result["soap:Envelope"]["soap:Body"][0][
                  "RetrieveResponseMsg"
                ][0]["Results"];
              if (senderDomainData != undefined) {
                let domainName =
                  result["soap:Envelope"]["soap:Body"][0][
                    "RetrieveResponseMsg"
                  ][0]["Results"][0]["Name"][0];
                let sendresponse = {
                  domainName: domainName,
                };
                return resolve(sendresponse);
              }
            }
          );
        })
        .catch(function (error: any) {
          let errorMsg = "Error getting the sender profile ID's domain";
          errorMsg += "\nMessage: " + error.message;
          errorMsg +=
            "\nStatus: " + error.response ? error.response.status : "<None>";
          errorMsg +=
            "\nResponse data: " + error.response.data
              ? JSON.stringify(error.response.data)
              : "<None>";
          return reject(errorMsg);
        });
    });
  }

  public async getApplicationUserInformation(tssd: any, authToken: any) {
    let self = this;
    let userInfoUrl =
      "https://" + tssd + ".auth.marketingcloudapis.com/v2/userinfo";
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    };

    return new Promise<any>(async (resolve, reject) => {
      await axios
        .get(userInfoUrl, { headers: headers })
        .then((response: any) => {
          const getUserInfoResponse = {
            appUserInfo: response.data,
          };

          return resolve(getUserInfoResponse);
        })
        .catch((error: any) => {
          // error
          let errorMsg = "Error getting User's Information.";
          errorMsg += "\nMessage: " + error.message;
          errorMsg +=
            "\nStatus: " + error.response ? error.response.status : "<None>";
          errorMsg +=
            "\nResponse data: " + error.response
              ? JSON.stringify(error.response.data)
              : "<None>";

          return reject(errorMsg);
        });
    });
  }

  //Checking for Domain Configuration Data extension
  public dataExtensionCheck(
    soapInstance: any,
    oauthToken: any,
    dataExtensionName: any
  ) {
    let soapMessage =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
      "    <s:Header>" +
      '        <a:Action s:mustUnderstand="1">Retrieve</a:Action>' +
      '        <a:To s:mustUnderstand="1">' +
      soapInstance +
      "Service.asmx" +
      "</a:To>" +
      '        <fueloauth xmlns="http://exacttarget.com">' +
      oauthToken +
      "</fueloauth>" +
      "    </s:Header>" +
      '    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
      '        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">' +
      "            <RetrieveRequest>" +
      "                <ObjectType>DataExtension</ObjectType>" +
      "                <Properties>ObjectID</Properties>" +
      "                <Properties>CustomerKey</Properties>" +
      "                <Properties>Name</Properties>" +
      '                <Filter xsi:type="SimpleFilterPart">' +
      "                    <Property>Name</Property>" +
      "                    <SimpleOperator>equals</SimpleOperator>" +
      "                    <Value>" +
      dataExtensionName +
      "</Value>" +
      "                </Filter>" +
      "            </RetrieveRequest>" +
      "        </RetrieveRequestMsg>" +
      "    </s:Body>" +
      "</s:Envelope>";

    return new Promise<any>((resolve, reject) => {
      axios({
        method: "post",
        url: "" + soapInstance + "Service.asmx" + "",
        data: soapMessage,
        headers: { "Content-Type": "text/xml" },
      })
        .then((response: any) => {
          let sendresponse = {};
          var parser = new xml2js.Parser();
          parser.parseString(
            response.data,
            (
              err: any,
              result: {
                [x: string]: {
                  [x: string]: { [x: string]: { [x: string]: any }[] }[];
                };
              }
            ) => {
              let DomainConfiguration =
                result["soap:Envelope"]["soap:Body"][0][
                  "RetrieveResponseMsg"
                ][0]["Results"];

              if (DomainConfiguration != undefined) {
                let DEexternalKeyDomainConfiguration =
                  DomainConfiguration[0]["CustomerKey"];
                //    this.DEexternalKeyDomainConfiguration =;
                //    DomainConfiguration[0]["CustomerKey"];
                sendresponse = {
                  statusText:
                    "Domain Configuration Data Extension already created",
                  soap_instance_url: soapInstance,
                  DEexternalKeyDomainConfiguration:
                    DEexternalKeyDomainConfiguration,
                };
                return resolve(sendresponse);
              } else {
                this.creatingDataExtension(
                  req,
                  res,
                  req.body.memberid,
                  req.body.soapInstance,
                  refreshTokenbody,
                  req.body.FolderID,
                  req.body.tssd
                );
              }
            }
          );
        })
        .catch((error: any) => {
          // error
          let errorMsg =
            "Error getting the 'Domain Configuration' Data extension properties......";
          errorMsg += "\nMessage: " + error.message;
          errorMsg +=
            "\nStatus: " + error.response ? error.response.status : "<None>";
          errorMsg +=
            "\nResponse data: " + error.response.data
              ? Utils.prettyPrintJson(JSON.stringify(error.response.data))
              : "<None>";
          Utils.logError(errorMsg);

          reject(errorMsg);
        });
    });
  }

  public creatingDataExtension(
    req: express.Request,
    res: express.Response,
    member_id: string,
    soap_instance_url: string,
    refreshToken: string,
    FolderID: string,
    tssd: string
  ) {
    //this.getRefreshTokenHelper(this._accessToken, res);
    console.log("creatingDataExtension:" + member_id);
    console.log("creatingDataExtension:" + soap_instance_url);
    console.log("creatingDataExtension:" + refreshToken);
    Utils.logInfo("creatingDataExtension:" + FolderID);
    console.log("creatingDataExtension:" + tssd);

    //console.log('domainConfigurationDECheck:'+req.body.ParentFolderID);

    let refreshTokenbody = "";
    this.getRefreshTokenHelper(refreshToken, tssd, false, res)
      .then((response) => {
        Utils.logInfo(
          "creatingDomainConfigurationDE:" +
            JSON.stringify(response.refreshToken)
        );
        Utils.logInfo(
          "creatingDomainConfigurationDE:" + JSON.stringify(response.oauthToken)
        );
        refreshTokenbody = response.refreshToken;
        Utils.logInfo(
          "creatingDomainConfigurationDE1:" + JSON.stringify(refreshTokenbody)
        );

        let DCmsg =
          '<?xml version="1.0" encoding="UTF-8"?>' +
          '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
          "    <s:Header>" +
          '        <a:Action s:mustUnderstand="1">Create</a:Action>' +
          '        <a:To s:mustUnderstand="1">' +
          soap_instance_url +
          "Service.asmx" +
          "</a:To>" +
          '        <fueloauth xmlns="http://exacttarget.com">' +
          response.oauthToken +
          "</fueloauth>" +
          "    </s:Header>" +
          '    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
          '        <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">' +
          '            <Objects xsi:type="DataExtension">' +
          "                <CategoryID>" +
          //Data extension's folder ID  +"</CategoryID>" +
          "                <CustomerKey>" +
          //Data Extension's External key * +"</CustomerKey>" +
          "                <Name>" +
          //Data Extension's name  +"</Name>" +
          "                <Fields>" +
          "                    <Field>" + //Different Field type
          "                        <CustomerKey>" +
          //FIELD ID+"</CustomerKey>" +
          "                        <Name>" +
          //FIELD NAME +"</Name>" +
          "                        <FieldType>Text</FieldType>" +
          "                        <MaxLength>50</MaxLength>" +
          "                        <IsRequired>true</IsRequired>" +
          "                        <IsPrimaryKey>false</IsPrimaryKey>" +
          "                    </Field>" +
          "                    <Field>" +
          "                        <CustomerKey>" +
          //FIELD ID +"</CustomerKey>" +
          "                        <Name>" +
          //FIELD NAME +"</Name>" +
          "                        <FieldType>Decimal</FieldType>" +
          "                        <Precision>18</Precision>" +
          "                          <Scale>0</Scale>" +
          "                        <IsRequired>false</IsRequired>" +
          "                        <IsPrimaryKey>false</IsPrimaryKey>" +
          "                    </Field>" +
          "                        <CustomerKey>" +
          //FIELD ID +"</CustomerKey>" +
          "                        <Name>" +
          //FIELD NAME +"</Name>" +
          "                        <FieldType>Date</FieldType>" +
          /**Optional Specification for date field type
           * "						         <DefaultValue>getdate()</DefaultValue>" +
           */
  /*"                        <IsRequired>true</IsRequired>" +
          "                        <IsPrimaryKey>false</IsPrimaryKey>" +
          "                    </Field>" +
          "                    <Field>" +
          "                        <CustomerKey>" +
          /***FIELD ID***/
          "                        <Name>" +
          /***FIELD NAME***/ /*+"</Name>" +
          "                        <FieldType>EmailAddress</FieldType>" +
          "                        <IsRequired>false</IsRequired>" +
          "                        <IsPrimaryKey>false</IsPrimaryKey>" +
          "                    </Field>" +
          "                </Fields>" +
          "            </Objects>" +
          "        </CreateRequest>" +
          "    </s:Body>" +
          "</s:Envelope>";

        return new Promise<any>((resolve, reject) => {
          let headers = {
            "Content-Type": "text/xml",
          };

          axios({
            method: "post",
            url: "" + soap_instance_url + "Service.asmx" + "",
            data: DCmsg,
            headers: headers,
          })
            .then((response: any) => {
              var parser = new xml2js.Parser();
              parser.parseString(
                response.data,
                (
                  err: any,
                  result: {
                    [x: string]: {
                      [x: string]: { [x: string]: { [x: string]: any }[] }[];
                    };
                  }
                ) => {
                  let DomainConfiguration =
                    result["soap:Envelope"]["soap:Body"][0][
                      "CreateResponse"
                    ][0]["Results"];

                  if (DomainConfiguration != undefined) {
                    let DEexternalKeyDomainConfiguration =
                      DomainConfiguration[0]["Object"][0]["CustomerKey"];

                    //this.DEexternalKeyDomainConfiguration =
                    // DomainConfiguration[0]["Object"][0]["CustomerKey"];
                    let sendresponse = {};
                    sendresponse = {
                      refreshToken: refreshTokenbody,
                      statusText:
                        "Domain Configuration Data extension has been created Successfully",
                      soap_instance_url: soap_instance_url,
                      member_id: member_id,
                      DEexternalKeyDomainConfiguration:
                        DEexternalKeyDomainConfiguration,
                    };
                    res.status(200).send(sendresponse);

                    /*  res
                .status(200)
                .send(
                  "Domain Configuration Data extension has been created Successfully"
                );*/
  /*}
                }
              );
            })
            .catch((error: any) => {
              // error
              let errorMsg =
                "Error creating the Domain Configuration Data extension......";
              errorMsg += "\nMessage: " + error.message;
              errorMsg +=
                "\nStatus: " + error.response
                  ? error.response.status
                  : "<None>";
              errorMsg +=
                "\nResponse data: " + error.response.data
                  ? Utils.prettyPrintJson(JSON.stringify(error.response.data))
                  : "<None>";
              Utils.logError(errorMsg);

              reject(errorMsg);
            });
        });
      })
      .catch((error: any) => {
        res
          .status(500)
          .send(Utils.prettyPrintJson(JSON.stringify(error.response.data)));
      });
  }*/
}
