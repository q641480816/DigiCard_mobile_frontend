package com.digicard.nativeModule;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class Debug extends ReactContextBaseJavaModule {
    public Debug(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "debug";
    }

    @ReactMethod
    public void invoke(String message) {
        Toast.makeText(getReactApplicationContext(), message,Toast.LENGTH_LONG).show();
    }
}