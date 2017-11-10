import Utils from "./util";

const Data = {
    availableColors: [
        '#000000',
        '#696969',
        '#808080',
        '#ADADAD',
        '#FFFFFF',
        '#336666',
        '#408080',
        '#5CADAD',
        '#95CACA',
        '#4D0000',
        '#EA0000',
        '#ff7575',
        '#6F00D2',
        '#B15BFF',
        '#0000C6',
        '#6A6AFF',
        '#0080FF',
        '#007979',
        '#00E3E3',
        '#019858',
        '#007500',
        '#79FF79',
        '#9AFF02',
        '#737300',
        '#C4C400',
        '#FFFF37',
        '#FFFF6F',
        '#FFD306',
        '#EA7500',
        '#FF9224',
        '#FFBB77',
        '#BB3D00',
        '#FF5809',
        '#FFAD86',
        '#804040',
        '#C48888',
        '#5A5AAD',
        '#8080C0'
    ],
    availableFontFamily: [
        {
            name: 'Josefin Sans',
            bold: true,
            italic: true
        },
        {
            name: 'Josefin Slab',
            bold: true,
            italic: true
        },
        {
            name: 'Ubuntu',
            bold: true,
            italic: true
        }
    ],
    newCard: {
        ownerId: '',
        cardName: 'New Card',
        ownerName: '',
        phone: '',
        email: '',
        contentSet: [{
            type: 'text',
            tag: 'Name',
            flag: true,
            value: 'Edit Name',
            property: {
                fontSize: 3,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecorationLine: 'none',
                color: '#808080',
                fontFamily: 'Ubuntu'
            },
            location: {
                left: 2,
                top: 2
            }
        },{
            type: 'text',
            tag: 'Phone',
            flag: true,
            value: 'Edit Phone',
            property: {
                fontSize: 3,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecorationLine: 'none',
                color: '#808080',
                fontFamily: 'Ubuntu'
            },
            location: {
                left: 2,
                top: 12
            }
        },{
            type: 'text',
            tag: 'Email',
            flag: true,
            value: 'Edit Email',
            property: {
                fontSize: 3,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecorationLine: 'none',
                color: '#808080',
                fontFamily: 'Ubuntu'
            },
            location: {
                left: 2,
                top: 22
            }
        }]
    }
};

export default Data;