import React, { Component } from 'react'
import { TextInput, Alert, TouchableWithoutFeedback, FlatList, RefreshControl, Text, View, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native'
import Entypo from "react-native-vector-icons/Entypo";
import * as constant from './Constants';
import LoadingIndicator from './LoadingIndicatior';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CheckBox from 'react-native-modest-checkbox'
import HomePageToolBar from './HomePageToolBar';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setFeedList } from '../actions/dataActions'
class PostDemo extends Component {


    onRefresh = () => {
        this.setState({ setRefreshing: true });
        this.getListfromApi()
    };

    componentDidMount() {
        this.setState({ isLoading: true });
        console.log("called home comopent componentDidMount")
        console.log("===========================")

        this.getListfromApi()
    }

    constructor() {
        super()

        this.state = {
            comment: '',
            checked: false,
            isLoading: false,
            refreshing: false,
            setRefreshing: false,
            placeHolderImage: 'https://www.mageworx.com/blog/wp-content/uploads/2012/06/Page-Not-Found-13.jpg',
            profilePicture: 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg'

        }



    }



    onPostClick(item) {
        console.log('clicked Post item');
        // this.props.navigation.popToTop();
        this.props.navigation.navigate('Details', { details: item })

        // console.log('clicked Post item 2');

        // Alert.alert(item.name, 'Complexity: ' + item.complexity + '                             ' +
        //     'Preparation Time: ' + item.preparationTime + '                                 ' +
        //     'No. of serves: ' + item.serves
        //     , [
        //         {
        //             text: 'OK',


        //         },

        //     ])
    }

    openCommnetScreen = (item) => {
        console.log('clicked commnet icon');
        this.props.navigation.navigate('Comments', { details: item })
    }

    render() {
        return <View>



            <SafeAreaView>
                <HomePageToolBar></HomePageToolBar>
                <LoadingIndicator isLoading={this.state.isLoading}></LoadingIndicator>
                {/* <Text>Test</Text> */}

                <FlatList
                    ItemSeparatorComponent={this.separator}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}></RefreshControl>
                    }
                    data={this.props.recipeFeed}

                    renderItem={({ item }) => {

                        return <View>
                            <View style={styles.postContainer}>
                                <View style={styles.header}>
                                    <Image style={styles.profileImage} source={{ uri: this.props.profilePicture }} />
                                    <View style={styles.nameandLocation}>
                                        <Text style={styles.userName}>{item.firstName}{item.lastName}</Text>
                                        <Text style={styles.locationName}>Ahmedabad,Gujarat</Text>

                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Entypo name='dots-three-vertical' size={15} />

                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => this.onPostClick(item)}>
                                    <Image source={(item.photo != null) ? { uri: item.photo } : { uri: this.state.placeHolderImage }} style={styles.image}></Image>
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <CheckBox
                                        style={{ width: 20 }}
                                        checkedComponent={<FontAwesome name='heart' size={23} color='red' />}
                                        uncheckedComponent={<FontAwesome name='heart-o' size={23} />}
                                        label=''
                                        checked={Boolean(Number(item.inCookingList))}
                                        onChange={(checked) => this.addToCookingList(item.recipeId, item.inCookingList)}
                                    />
                                    <TouchableWithoutFeedback onPress={() => this.openCommnetScreen(item)}>
                                        <Image style={styles.iconComment} source={require('../../images/Comment-1.jpg')}  />

                                    </TouchableWithoutFeedback>


                                    <Image style={styles.icon} source={require('../../images/Send-1.jpg')} />

                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>

                                        <FontAwesome name='bookmark-o' size={23} />
                                    </View>


                                </View>
                                <View style={styles.likeSpantext}>
                                    <Text style={styles.caption}>Serve to</Text>
                                    <Text style={styles.userName}> {item.serves}</Text>
                                    <Text style={styles.caption}> peoples</Text>
                                </View>

                                <View style={styles.bottom}
                                >
                                    <Text style={styles.userName}>{item.firstName}{item.lastName}</Text>
                                    <Text style={styles.caption}> {item.name}</Text>

                                </View>
                                <View style={styles.bottom}>
                                    <Image style={styles.commentProfileImage} source={{ uri: this.props.profilePicture }} />
                                    <TextInput
                                        value={this.state.comment}
                                        placeholder="Add a comment..."
                                        onChangeText={(comment) => this.setState({ comment })}
                                        style={{ marginStart: 5, paddingVertical: 0 }}
                                        onSubmitEditing={() => this.sendComment(item)}

                                    ></TextInput>
                                </View>
                            </View>


                        </View>
                    }}
                    keyExtractor={(item) => item.recipeId}
                    extraData={this.state}
                    contentContainerStyle={{ paddingBottom: 20 }}
                ></FlatList>
            </SafeAreaView>
        </View>
    }
    sendComment = (item) => {
        var commentText = this.state.comment
        console.log(item.recipeId + '  commnet is : ' + this.state.comment);
        this.setState({ comment: '' })

        var API = constant.ADD_COMMENT + item.recipeId + '/comments'
        console.log(API);
        fetch(API,
            {
                method: 'POST',
                headers: {
                    'Authorization': this.props.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'comment': commentText,

                })
            }
        ).then((response) => {
            if (response.status == 200) {
                console.log("Comment added Sucess")
                return response.json()
            } else {
                console.log("Comment added Failed")
            }
        }).then((responseJson) => {
            console.log(responseJson)

        }).catch((error) => {
            console.log(error)
        });

    }

    addToCookingList = (recipeId, inCookinList) => {
        var API = ''
        if (inCookinList == 0) {
            console.log("in Cookong List: " + inCookinList);

            API = 'http://35.160.197.175:3006/api/v1/recipe/add-to-cooking-list'
        } else {
            console.log("in Cookong List: " + inCookinList);

            API = 'http://35.160.197.175:3006/api/v1/recipe/rm-from-cooking-list'
        }
        fetch(API,
            {
                method: 'POST',
                headers: {
                    'Authorization': this.props.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({

                    'recipeId': recipeId,

                })
            }
        ).then((response) => {
            if (response.status == 200) {
                console.log("Cooking List Sucess")
                this.getListfromApi()
                return response.json()
            } else {
                console.log("Cooking List failed")
            }
        }).then((responseJson) => {

        }).catch((error) => {
            console.log(error)
        });
    }

    separator = () => (
        <View
            style={styles.dividerLine}
        />
    );

    getListfromApi = () => {
        fetch(constant.API_FOR_FEED_LIST,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.props.token
                },

            }).then((response) => {
                if (response.status == 200) {
                    return response.json().then((responseJSON) => {
                        //console.log(responseJSON);
                        // this.setState({ recipesList: responseJSON });
                        //DATA = responseJSON
                        //console.log(this.state.recipesList);
                        this.setState({ isLoading: false });
                        this.props.setFeedList(responseJSON)

                    })
                } else {
                    console.log(response.body);
                    Alert.alert('Error', 'Please try again later.', [
                        {
                            text: 'Ok',
                        },

                    ])
                    this.setState({ isLoading: false });


                }
            })
    }



}
const mapDispatchToProps = (dispatch) => {
    return {
        setFeedList: (list) => {
            dispatch(setFeedList(list))
        }
    }
}
const mapStateToProps = (state) => {
    console.log("called ==" + state.userReducer.token);

    return { token: state.userReducer.token, recipeFeed: state.dataReducer.recipeFeed,profilePicture: state.userReducer.userProfilePic }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDemo)


const styles = StyleSheet.create({

    iconcamera: {
        height: 22,
        width: 25,
        marginStart: 10
    },
    titleToolbar: {
        marginTop: 5,
        fontSize: 20,
        marginStart: 15,
        fontFamily: 'Blessed',
        textAlign: "center"
    },
    toolBar: {
        padding: 5,

        flexDirection: 'row',
        alignItems: 'center'
    },
    likeSpantext: {
        marginStart: 10,

        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    caption: {
        fontSize: 13,
        fontWeight: '800',

    },
    bottom: {
        marginStart: 10,
        marginBottom: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',


    },
    iconComment: {
        height: 20,
        width: 21,

    },
    icon: {
        height: 19,
        width: 25,
        marginStart: 20
    },
    locationName: {
        fontSize: 12,
        fontWeight: '500'
    },
    nameandLocation: {
        marginStart: 8
    },
    profileImage: {
        height: 30,
        width: 30,
        borderRadius: 100
    },
    userName: {
        textTransform: 'lowercase',
        fontSize: 14,
        fontWeight: 'bold',

    },
    header: {
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',


    },
    image: {
        height: 220,
        width: '100%'
    },
    postContainer: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    dividerLine: {
        backgroundColor: 'rgba(178,178,178,0.8)',
        height: 0.5,
    },
    commentProfileImage: {
        height: 20,
        width: 20,
        borderRadius: 100
    }



})