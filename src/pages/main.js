import React, {Component} from 'react';
import api from '../services/api';
import {Alert, View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

export default class Main extends Component {
    static navigationOptions = {
        title: 'Mobile',
        headerStyle: {
          backgroundColor: '#da552f',
        },
        headerTintColor: '#fff',
    }

    state = {
        page: 1,
        docs: [],
        info: {},
        isFetching: false               
    }

    componentDidMount() {
        this.loadProducts();
    }

    loadProducts = async (page = 1) => {
        try {
            const responde = await api.get(`/products?page=${page}`);
            let {docs, ...info} = responde.data;
            if (page !== 1) docs = [...this.state.docs, ...docs]
            this.setState({
                page,
                docs,
                info,
                isFetching: false 
                });
        } catch (e) {
            Alert.alert('Erro ao acessar a Api!')
        }
    }

    loadMore = () => {
        const {page, info} = this.state;
        if (page === info.pages) return;
        const nextPage = page + 1
        this.loadProducts(nextPage);
    };

    renderItem = ({item}) => (
        <View style={styles.prodContainer}>
            <Text style={styles.prodTitle}>{item.title}</Text>
            <Text style={styles.prodDesc}>{item.description}</Text>
            <TouchableOpacity style={styles.prodButton} onPress={() => {
                this.props.navigation.navigate('Product', {product: item})
            }}>
              <Text style={styles.prodButtonTxt}>Acessar</Text>  
            </TouchableOpacity>
        </View>
    )

    onRefresh = () => {
        this.setState({ isFetching: true }, () => {this.loadProducts()})
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.list}
                    data={this.state.docs}
                    keyExtractor={item => item._id}
                    renderItem={this.renderItem}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.4}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isFetching}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    list: {
        padding : 20
    },
    prodContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 20,
        marginBottom: 20
    },

    prodTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },

    prodDesc: {
        fontSize: 16,
        color: '#999',
        marginTop: 5,
        lineHeight: 24
    },

    prodButton: {
        height: 42,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#da552f',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10 
    },

    prodButtonTxt: {
        fontSize: 16,
        color: '#da552f',
        fontWeight: 'bold'
    }
});