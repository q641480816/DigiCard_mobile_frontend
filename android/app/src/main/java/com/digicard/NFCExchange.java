package com.digicard;

import android.content.Context;
import android.content.Intent;
import android.nfc.NdefMessage;
import android.nfc.NfcAdapter;
import android.nfc.NfcEvent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.digicard.util.MNdefMessage;

public class NFCExchange extends AppCompatActivity implements NfcAdapter.CreateNdefMessageCallback{

    private final String url = "www.card-digi.com/#/download?id=";
    private Context mContext;
    private NfcAdapter mNfcAdapter;
    private Intent intent;
    private String id;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nfcexchange);

        //init
        mContext = this;
        intent = getIntent();
        id = intent.getStringExtra("id");
        bindView();
        setListeners();

        //setNFC
        mNfcAdapter = NfcAdapter.getDefaultAdapter(mContext);
        mNfcAdapter.setNdefPushMessageCallback(this, this);
    }

    private void bindView(){

    }

    private void setListeners(){

    }

    @Override
    public NdefMessage createNdefMessage(NfcEvent nfcEvent) {
        String url = this.url + this.id;
        NdefMessage message = null;
        String action = getIntent().getStringExtra("action");
        if(action.equals("browser")){
            message = MNdefMessage.getNdefMsg_from_RTD_URI(url,(byte)0x03,false);
        }else if(action.equals("application")){
            message = MNdefMessage.getNdefMsg_from_RTD_TEXT(url, false, false);
        }
        return message;
    }
}
