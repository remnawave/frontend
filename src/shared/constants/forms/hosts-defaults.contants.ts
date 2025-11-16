export const BASIC_XHTTP_EXTRA_PARAMS = `{
    "headers": {},
    "xPaddingBytes": "100-1000",
    "noGRPCHeader": false,
    "scMaxEachPostBytes": 1000000,
    "scMinPostsIntervalMs": 30,
    "scStreamUpServerSecs": "20-80",
    "xmux": {
      "maxConcurrency": "16-32",
      "maxConnections": 0,
      "cMaxReuseTimes": 0,
      "hMaxRequestTimes": "600-900",
      "hMaxReusableSecs": "1800-3000",
      "hKeepAlivePeriod": 0
    },
    "downloadSettings": {
      "address": "",
      "port": 443,
      "network": "xhttp",
      "security": "tls",
      "tlsSettings": {},
      "xhttpSettings": {
        "path": "/yourpath"
      },
      "sockopt": {}
    }
  }`

export const PASTE_BASIC_XHTTP_EXTRA_PARAMS = `{
    "headers": {},
    "xPaddingBytes": "100-1000",
    "noGRPCHeader": false,
    "scMaxEachPostBytes": 1000000,
    "scMinPostsIntervalMs": 30,
    "scStreamUpServerSecs": "20-80",
    "xmux": {
      "maxConcurrency": "16-32",
      "maxConnections": 0,
      "cMaxReuseTimes": 0,
      "hMaxRequestTimes": "600-900",
      "hMaxReusableSecs": "1800-3000",
      "hKeepAlivePeriod": 0
    }
  }
  `

export const BASIC_MUX_PARAMS = `{
    "enabled": true,
    "concurrency": -1,
    "xudpConcurrency": 16,
    "xudpProxyUDP443": "reject"
  }`

export const BASIC_SOCKOPT_PARAMS = `{
    "mark": 0,
    "tcpMaxSeg": 1440,
    "tcpFastOpen": false,
    "tproxy": "off",
    "domainStrategy": "AsIs",
    "dialerProxy": "",
    "happyEyeballs": {},
    "acceptProxyProtocol": false,
    "tcpKeepAliveInterval": 0,
    "tcpKeepAliveIdle": 300,
    "tcpUserTimeout": 10000,
    "tcpcongestion": "bbr",
    "interface": "wg0",
    "V6Only": false,
    "tcpWindowClamp": 600,
    "tcpMptcp": false,
    "tcpNoDelay": false
  }`
