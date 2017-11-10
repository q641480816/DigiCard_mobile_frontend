import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

const PStorage = new Storage({
    size: 100,

    storageBackend: AsyncStorage,

    defaultExpires: 1000 * 3600 * 24 * 7 * 24,

    enableCache: true,

    sync: {
        syncCard: ()=>{
            let t = {
                cards: [{
                    id:0,
                    name: 'Personal Name Card',
                    contentSet: [{
                        type: 'text',
                        tag: 'Name',
                        flag: true,
                        value: 'Liu jinlong(Mr.)',
                        property:{
                            fontSize: 3
                        },
                        location: {
                            left: 7,
                            top: 20
                        }
                    },{
                        type: 'text',
                        tag: 'duty',
                        flag: true,
                        value: 'CEO',
                        property:{
                            fontSize: 3
                        },
                        location: {
                            left: 60,
                            top: 20
                        }
                    },{
                        type: 'text',
                        tag: 'company',
                        flag: true,
                        value: 'LittleTarget Tech PTL.',
                        property:{
                            fontSize: 2
                        },
                        location: {
                            left: 7,
                            top: 62.5
                        }
                    },{
                        type: 'text',
                        tag: 'company address',
                        flag: true,
                        value: 'Address: Lor Ah Soo 50c, Singapore',
                        property:{
                            fontSize: 1.5
                        },
                        location: {
                            left: 7,
                            top: 72.5
                        }
                    }, {
                        type: 'text',
                        tag: 'telephone',
                        flag: true,
                        value: 'Tel: +65 98674817',
                        property:{
                            fontSize: 1.5
                        },
                        location: {
                            left: 7,
                            top: 80
                        }
                    },{
                        type: 'text',
                        tag: 'email',
                        flag: true,
                        value: 'q641480816@gmail.com',
                        property:{
                            fontSize: 1.5
                        },
                        location: {
                            left: 7,
                            top: 87.5
                        }
                    }]
                },
                    {
                    id:2,
                    name: 'Test Card 2',
                    contentSet: [{
                        type: 'text',
                        tag: 'Name',
                        flag: true,
                        value: 'Edit name',
                        property: {
                            fontSize: 3
                        },
                        location: {
                            left: 2,
                            top: 2
                        }
                    }]
                }]
            };
        }
    }
});

module.exports = PStorage;