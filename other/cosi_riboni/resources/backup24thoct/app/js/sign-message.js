/*
 * JavaScript client-side example using jsrsasign
 */

// #########################################################
// #             WARNING   WARNING   WARNING               #
// #########################################################
// #                                                       #
// # This file is intended for demonstration purposes      #
// # only.                                                 #
// #                                                       #
// # It is the SOLE responsibility of YOU, the programmer  #
// # to prevent against unauthorized access to any signing #
// # functions.                                            #
// #                                                       #
// # Organizations that do not protect against un-         #
// # authorized signing will be black-listed to prevent    #
// # software piracy.                                      #
// #                                                       #
// # -QZ Industries, LLC                                   #
// #                                                       #
// #########################################################

/**
 * Depends:
 *     - jsrsasign-latest-all-min.js
 *     - qz-tray.js
 *
 * Steps:
 *     1. Convert private key to jsrsasign compatible format:
 *        openssl rsa -in private-key.key -out private-key-updated.key
 *
 *     2. Include jsrsasign into your web page
 *        <script src="https://cdn.rawgit.com/kjur/jsrsasign/master/jsrsasign-latest-all-min.js"></script>
 *
 *     3. Include this script into your web page
 *        <script src="path/to/sign-message.js"></script>
 *
 *     4. Remove any other references to setSignaturePromise
 */
var privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
"MIIEpAIBAAKCAQEAs0uYm6XIiJ3kapqaGjAVvKvlV5XEFhoYQV3qyJpffHJOkvtB\n" +
"UiOWeeESnLPYLmuzy4DGipxwQarjCvfuoATCaYhW/iQhN5vcLRWxK0Z44NItftw0\n" +
"4LHWXcHEW3NgoewbpCVs2NYfRD+oe+VNM5JcDiiYFDv78VL81QaGYhkgD4ZFAisS\n" +
"nRVehL6oFpXOBWj7LQVDsXLltwNKIhTy7l9Kk8ebg7w/34xm/ixsLfxMVdBn0x9X\n" +
"R62VMEhuxcp7CUCilhuWuKjDjQCtBtYvGXjB094By9sDHpSsX71+XskAFEy/s5Vt\n" +
"RxI9JU/4ikOIkbBvd0ddP5fnop7NTxzx+XlXgwIDAQABAoIBAQCglGwxuuFHumIB\n" +
"OEYcfkR5nlrhfrkIMobWxI6q69fpVVcaPP3b2xPCRNqujkRoDv4QnV00d7fymGKQ\n" +
"SE3n81tLuVhwdVtquqUPnAX5hDxu3s7wd7jEJYKgphJ+9W7ultCKyxoZemy2a20y\n" +
"ycPDFKpt492RAcg78t+OyzFAWtBkFZNw+Ali522PnCxAPWvPgyjp5ml+MHgdSVFT\n" +
"L/eHUPoPeVnifZtGLWl+ehx2sZT7UbE9KN+5yNTtFwEegyHfA9fGz4zBDLVuESgV\n" +
"KT+cLOC6lBhTu/Dm+HCUp/zIimU7q3XNNwKnmiZ770QUksdQsqNCuOUKI/Lpa+tf\n" +
"xJzn0KUBAoGBAO54/O+RqXbYq6FDTnbLu7FxD+JwUdAMrQs3KnQqKcG+93xi1uKb\n" +
"bNg3Qan75NwwyWmlN11aXGdJALx2R9czdWEMippuaKQ+nv3b+AVWBZYCNfq180DP\n" +
"hE+mAR7W/sZdLns+1c5WpzU9gCckLU8uvCLLMX0DZtAHOqIyKm7QKPtRAoGBAMB5\n" +
"JliFS2JJHTK8EYUn9NlTfvFfKZIZSTy8FfVU1TFSMtvpElCDn4G+12GB5bORnauG\n" +
"qUohngQuncgyz5MK+pMIXZMW0FYKAAfVnym0djhh4Jv4DekGn31cpHdTAKGYnrJ3\n" +
"agg/iAjAUwKvFcnbkPIa4hkGhivAPfDuwDaODoiTAoGBAMYFSWNVvTam7L3YOguD\n" +
"WbQagmoxgn4USI0LngEgEdSEUtXC7VT2YweXursAJCaDjHxhaPvn0NsjT60vOrCE\n" +
"Vm/kDiP2koXwSe3a/rTPnYvXAiPRetDSgLfyzPNi6+Sj87j7kGbqpaYcD5JxA/7A\n" +
"fBEYUVvRu0n69sFAjuO9jopBAoGAUv+rRn7sfAy1V5x8HaSWVGVKF4IG5iabS2J8\n" +
"QZf8e1FL90Lxj+DCluuZ60VdrWq8yCvAsuP+RSVpCtzGYE1asq7n0zcCTifvzXEU\n" +
"OqLEXBnxBrEYJoWhnyilD4OugQDUZndSNQ5YdhWhdkXUKoDRZ2WqXEpQ72ruCwiZ\n" +
"wKzPnZsCgYASHSVGZqzi9K3WJcsx/MJL5DBu7hQtQqP+UT3Wwiqx3LvygCuhw28d\n" +
"mTnvRklCHZJ7J9QDVA0gqec+S7vaQMkq/FMdkqlh28nWA1PCMNXT5N8sYSvr0+gh\n" +
"X1aDEzOl2+/Zi+3+05Ud2UNvec1HvO0ESRkhwBwpQlt02N6ZwHAFtg==\n" +
"-----END RSA PRIVATE KEY-----\n";

qz.security.setSignaturePromise(function(toSign) {
    return function(resolve, reject) {
        try {
            var pk = new RSAKey();
            pk.readPrivateKeyFromPEMString(strip(privateKey));
            var hex = pk.signString(toSign, 'sha1');
            console.log("DEBUG: \n\n" + stob64(hextorstr(hex)));
            resolve(stob64(hextorstr(hex)));
        } catch (err) {
            console.error(err);
            reject(err);
        }
    };
});

function strip(key) {
    if (key.indexOf('-----') !== -1) {
        return key.split('-----')[2].replace(/\r?\n|\r/g, '');
    }
}