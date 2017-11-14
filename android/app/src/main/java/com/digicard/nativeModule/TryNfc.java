package com.digicard.nativeModule;

import android.content.Intent;
import android.nfc.NfcAdapter;
import android.provider.Settings;

import com.digicard.NFCExchange;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class TryNfc extends ReactContextBaseJavaModule {
    public TryNfc(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNNFCPush";
    }

    @ReactMethod
    public void invoke(String id, Promise promise) {
        NfcAdapter mNfcAdapter;
        mNfcAdapter = NfcAdapter.getDefaultAdapter(getReactApplicationContext());
        try {
            if(mNfcAdapter == null){
                promise.reject("0", "NFC Not Supported");
            }else{
                if(!mNfcAdapter.isEnabled()){
                    promise.reject("1", "NFC Is off");
                }else{
                    if(!mNfcAdapter.isNdefPushEnabled()){
                        promise.reject("2", "Android Beam Push Is Off");
                    }else{
                        promise.resolve("Pushing mother fucker!!!");
                        Intent it = new Intent(getReactApplicationContext(), NFCExchange.class);
                        it.putExtra("id",id);
                        getReactApplicationContext().startActivity(it);
                    }
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            promise.reject("3",e.getMessage());
        }
    }

    @ReactMethod
    public void goAndroidPushSetting() {
        Intent setNfc = new Intent(Settings.ACTION_NFCSHARING_SETTINGS);
        getCurrentActivity().startActivity(setNfc);
    }
}
