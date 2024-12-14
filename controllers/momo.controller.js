// import https from 'https'
export const MoMopayment = async (req, respond) => {
  const { totalPrice, ...rest } = req.body
  console.log(req.body)

  // Code của momo payment
  var accessKey = "F8BBA842ECF85"
  var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
  var orderInfo = "pay with MoMo"
  var partnerCode = "MOMO"
  var redirectUrl = "http://localhost:4444/thanks"
  var ipnUrl = "https://180f-14-232-159-102.ngrok-free.app/api/payment/ipnUrl"
  var requestType = "payWithATM"
  var amount = 50000
  var orderId = partnerCode + new Date().getTime()
  var requestId = orderId
  var extraData = btoa(JSON.stringify({ name: 'thanh'}))
  // Buffer.from(JSON.stringify({ ...rest })).toString("base64")
  var paymentCode =
    "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA=="
  var orderGroupId = ""
  var autoCapture = true
  var lang = "vi"

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------")
  console.log(rawSignature)
  //signature
  const crypto = await import("crypto")
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex")
  console.log("--------------------SIGNATURE----------------")
  console.log(signature)

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId, 
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  })
  //Create the HTTPS objects
  const https = await import("https")
  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
  }
  //Send the request and get the response
  req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`)
    console.log(`Headers: ${JSON.stringify(res.headers)}`)
    res.setEncoding("utf8")
    res.on("data", (body) => {
      console.log("Body: ")
      console.log(body)
      console.log("body: ")
      // console.log({...JSON.parse(body), name: 'thanh'})
      respond
        .status(201)
        .json({ message: "Successfully!", data: JSON.parse(body)} )
    })
    res.on("end", () => {
      console.log("No more data in response.")
    })
  })

  req.on("error", (e) => {
    console.log(`problem with request: ${e.message}`)
  })
  // write data to request body
  console.log("Sending....")
  req.write(requestBody)
  req.end()
}

export const conFirmedSuccessPayment = async (req, res)=>{
  console.log('res')
  console.log("return url", req.body)
  // return url {
  //   partnerCode: 'MOMO',
  //   orderId: 'MOMO1734061448547',
  //   requestId: 'MOMO1734061448547',
  //   amount: 500000,
  //   orderInfo: 'pay with MoMo',
  //   orderType: 'momo_wallet',
  //   transId: 4265634543,
  //   resultCode: 0,
  //   message: 'Successful.',
  //   payType: 'napas',
  //   responseTime: 1734061480771,
  //   extraData: 'eyJkYXRhIjp7InByaWNlIjo1MDAwMDAsInVzZXJJZCI6IjY3NGZiNWQ0NmRiYWM0YjQ3OTczMGEyYyJ9fQ==',
  //   signature: 'dd3cd8fc732c98122fb43854503bcbabc7303446182bbefb4776d925aed8404d'
  // }
  return res.status(204).json({message: "Successfully"})
}