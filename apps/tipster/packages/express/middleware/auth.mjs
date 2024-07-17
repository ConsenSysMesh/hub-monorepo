import { app } from '@tipster/express/app.mjs';
import { SiweMessage } from 'siwe';

const nonAuthenticatedPaths = ['/api/webhook', '/api/frames', '/api/actions'];

function base64ToObj(base64) {
    const binString = atob(base64);
    const uInt8Array = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return JSON.parse(new TextDecoder().decode(uInt8Array));
}

app.use(async (req, res, next) => {
    try {
        if (nonAuthenticatedPaths.find((p) => req.path.startsWith(p))) {
            return next();
        }
        // add auth info and block on invalid auth
        const authHeader = req.headers['authentication'];
        if (!authHeader) {
            res.sendStatus(401);
            return null;
        }
        const authObj = base64ToObj(authHeader);

        if (!authObj.message) {
            res.sendStatus(401).json({ error: 'FailedSiweVerification', errorMsg: 'Missing message' });
            return;
        }
        if (!authObj.nonce) {
            res.sendStatus(401).json({ error: 'FailedSiweVerification', errorMsg: 'Missing nounce' });
            return;
        }
        if (!authObj.signature) {
            res.sendStatus(401).json({ error: 'FailedSiweVerification', errorMsg: 'Missing signature' });
            return;
        }

        let SIWEObject = new SiweMessage(authObj.message);
        try {
            await SIWEObject.verify({
                signature: authObj.signature,
                nonce: authObj.nonce,
            });
        } catch (e) {
            res.sendStatus(401).json({ error: "SiweVerificationFailed", errorMsg: 'Failed SIWE verification' });
            logger.error('[auth] Failed SIWE verification', e);
            return;
        }
        req.context = {
            ...authObj
        };
        return next();
    } catch (e) {
        next(e);
    }
});
