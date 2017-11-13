package com.digicard.nativeModule;

import android.content.Intent;

import com.digicard.NFCExchange;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by Gods on 11/6/2017.
 */

public class TryNfc extends ReactContextBaseJavaModule {
    public TryNfc(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNNFCPush";
    }

    @ReactMethod
    public void invoke(String id) {
        Intent it = new Intent(getReactApplicationContext(), NFCExchange.class);
        getCurrentActivity().startActivity(it);
    }
}
