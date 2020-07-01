import React, {MutableRefObject, useCallback, useEffect, useRef, useMemo, useState} from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    TouchableWithoutFeedback as ButtonPressAnimation,
    Text, View,
} from 'react-native';
import Reanimated, {
    Clock,
    Easing as REasing,
    Value as RValue,
    timing,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import * as Notifications from 'expo-notifications';
import firebase from "firebase";
import 'firebase/firestore'
import {decode, encode} from 'base-64'
import {firebaseConfig} from './firebaseConfig'

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

if (! global.btoa) {
    global.btoa = encode
}

if (! global.atob) {
    global.atob = decode
}


const {
    and,
    block,
    clockRunning,
    color,
    not,
    set,
    cond,
    interpolate,
    round,
    divide,
    startClock,
} = Reanimated;

const emojis = ["🥰", "😍", "😇", "😎", "😬", "👨🏻‍💻", "🙆‍", "️👨", "‍❤️", "‍💋", "‍👨", "👬", "🐙", "🌈", "❤️", "🧡", "💛", "💚", "💙", "🤎", "💗", "🤍", "❣️", "💕", "💞", "💖", "💝", "💘", "♥️", "‍🌈"]

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


const addUnitToNumberValues = (value: number) => value ? `${value}px` : value;

const build = (
    x: number,
    y: number,
    radius: number,
    color = 'black',
    opacity = 0.4
) => `
  shadow-color: ${color};
  shadow-offset: ${addUnitToNumberValues(x)} ${addUnitToNumberValues(y)};
  shadow-opacity: ${opacity};
  shadow-radius: ${addUnitToNumberValues(radius / 2)};
`;

const ButtonContainer = styled(Reanimated.View)`
  border-radius: ${({height}) => height / 2}px;
`;

const ButtonContent = styled.View.attrs({
    align: 'center',
    margin: 4,
})`
  justify-content: center
  align-self: center;
  height: 100%;
  padding-bottom: 4px;
`;

const ButtonLabel = styled(Text)`
  font-size: 40px;

`;


const DarkShadow = styled(Reanimated.View)`
  ${build(0, 10, 30, '#25292E', 1)};
  background-color: white;
  border-radius: 50px;
  height: 100px;
  left: -3px;
  opacity: 0.2;
  position: absolute;
  top: -3px;
  width: 106px;
`;

const Shadow = styled(Reanimated.View)`
  ${build(0, 5, 15, '#25292E', 0.4)};
  border-radius: 50px;
  height: 100px;
  left: -3px;
  position: absolute;
  top: -3px;
  width: 106px;
`;

const PrettyButton = ({
                           darkShadowStyle,
                           height,
                           onPress,
                           onPressIn,
                           shadowStyle,
                           style,
                           textColor,
                       }: {
    darkShadowStyle: any,
    height: number,
    onPress: () => void,
    onPressIn: () => void,
    shadowStyle: any,
    style: any,
    textColor: any
}) => {
    return (
        <ButtonPressAnimation onPress={onPress} onPressIn={onPressIn}>
            <View>
                <DarkShadow style={darkShadowStyle}/>
                <Shadow style={shadowStyle}/>
                <ButtonContainer height={height} style={style}>
                    <ButtonContent>
                        <ButtonLabel textColor={textColor}>❤</ButtonLabel>
                    </ButtonContent>
                </ButtonContainer>
            </View>
        </ButtonPressAnimation>
    );
};

const Container = styled.View`
  ${StyleSheet.absoluteFillObject};
  align-items: center;
  background-color: white;
  justify-content: center;
`;

const ContentWrapper = styled(Animated.View)`
  align-items: center;
  height: 192px;
  justify-content: space-between;
  margin-bottom: 20px;
  z-index: 10;
`;

const ButtonWrapper = styled(Animated.View)`
  width: 100%;
`;

const INITIAL_SIZE = 150;

export const useAnimatedValue = (initialValue: number): MutableRefObject<Animated.Value> => {
    const value = useRef<Animated.Value>();

    if (! value.current) {
        value.current = new Animated.Value(initialValue);
    }

    return value as MutableRefObject<Animated.Value>;
};

export const useReanimatedValue = (initialValue: number): MutableRefObject<RValue<number>> => {
    const value = useRef<RValue<number>>();

    if (! value.current) {
        value.current = new RValue(initialValue);
    }

    return value as MutableRefObject<RValue<number>>;
};

const rainbows = [
    {
        delay: 0,
        rotate: '150deg',
        scale: 0.5066666667,
        x: -116,
        y: -202,
    },
    {
        delay: 20,
        rotate: '394.75deg',
        scale: 0.3333333333,
        x: 149,
        y: 380,
    },
    {
        delay: 40,
        rotate: '360deg',
        scale: 0.6666666667,
        x: 173,
        y: -263,
    },
    {
        delay: 60,
        rotate: '-33deg',
        scale: 0.2826666667,
        x: -122,
        y: 150,
    },
    {
        delay: 80,
        rotate: '75deg',
        scale: 0.42248,
        x: 120,
        y: 70,
    },
    {
        delay: 0,
        rotate: '130deg',
        scale: 0.5066666667,
        x: -100,
        y: 100,
    },
    {
        delay: 20,
        rotate: '304.75deg',
        scale: 0.3333333333,
        source: {uri: 'neon'},
        x: 40,
        y: 70,
    },
    {
        delay: 40,
        rotate: '700deg',
        scale: 0.3666666667,
        x: 33,
        y: -163,
    },
    {
        delay: 60,
        rotate: '-733deg',
        scale: 0.2826666667,
        x: 172,
        y: 180,
    },
    {
        delay: 80,
        rotate: '175deg',
        scale: 0.42248,
        x: -40,
        y: 215,
    },
    {
        delay: 40,
        rotate: '50deg',
        scale: 0.90666666667,
        x: 54,
        y: 113,
    },
    {
        delay: 60,
        rotate: '-33deg',
        scale: 0.4826666667,
        x: 80,
        y: 90,
    },
    {
        delay: 80,
        rotate: '225deg',
        scale: 0.62248,
        x: 70,
        y: 35,
    },
];

const traversedRainbows = rainbows.map(
    ({
         delay,
         initialRotate = '0deg',
         rotate = '0deg',
         scale = 1,
         x = 0,
         y = 0,
     }: ({ delay: number, initialRotate?: string, rotate?: string, scale: number, x: number, y: number })) => {
        const animatedValue = new Animated.Value(0);
        return {
            delay,
            style: {
                opacity: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }),
                transform: [
                    {
                        translateX: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, x],
                        }),
                    },
                    {
                        translateY: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, y],
                        }),
                    },
                    {
                        rotate: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [initialRotate, rotate],
                        }),
                    },
                    {
                        scale: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, scale],
                        }),
                    },
                ],
            },
            value: animatedValue,
        };
    }
);

const RainbowImage = styled(Animated.View)`
  height: ${INITIAL_SIZE}px;
  position: absolute;
  width: ${INITIAL_SIZE}px;
`;

function runTiming(value: RValue<number>) {
    const clock = new Clock();
    const state = {
        finished: new RValue(0),
        frameTime: new RValue(0),
        position: new RValue(0),
        time: new RValue(0),
    };

    const config = {
        duration: 2500,
        easing: REasing.linear,
        toValue: new RValue(1),
    };

    return block([
        cond(and(not(state.finished), clockRunning(clock)), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, 5),
            startClock(clock),
        ]),
        timing(clock, state, config),
        state.position,
    ]);
}

const HeartText = styled.Text`
  font-size: 120px;
`

const colorsRGB = [
    {b: 74, g: 73, r: 255},
    {b: 0, g: 170, r: 255},
    {b: 111, g: 222, r: 0},
    {b: 217, g: 163, r: 0},
    {b: 255, g: 92, r: 115},
];


const colorRGB = (r: Reanimated.Node<number>, g: Reanimated.Node<number>, b: Reanimated.Node<number>, fromShadow: boolean) =>
    // from some reason there's a different bit shifting with shadows
    fromShadow
        ? color(round(r), round(b), 255, divide(round(r), 256))
        : color(round(r), round(g), round(b));

const springConfig = {
    bounciness: 7.30332,
    speed: 0.6021408,
    toValue: 1,
    useNativeDriver: true,
};

function selectRandomEmojis() {
    const selectedEmojis = []
    for (let i = 0; i < 10; i++) {
        const item = emojis[Math.floor(Math.random() * emojis.length)];
        selectedEmojis.push(item)
    }

    return selectedEmojis
}

async function getTokens() {
    const tokens = await db.collection("tokes").get()
    return tokens.docs.map(t => t.data().token).filter(Boolean)
}

function colorAnimation(rValue: MutableRefObject<RValue<any>>, fromShadow: boolean) {
    const animation = runTiming(rValue.current);
    const r = interpolate(animation, {
        inputRange: [0, 1, 2, 3, 4, 5],
        outputRange: [...colorsRGB.map(({r}) => r), colorsRGB[0].r],
    });

    const g = interpolate(animation, {
        inputRange: [0, 1, 2, 3, 4, 5],
        outputRange: [...colorsRGB.map(({g}) => g), colorsRGB[0].g],
    });

    const b = interpolate(animation, {
        inputRange: [0, 1, 2, 3, 4, 5],
        outputRange: [...colorsRGB.map(({b}) => b), colorsRGB[0].b],
    });
    return colorRGB(r, g, b, fromShadow);
}

export default function App() {
    const [selectedEmojis, setSelectedEmojis] = useState(selectRandomEmojis)
    const contentAnimation = useAnimatedValue(1);
    const createWalletButtonAnimation = useAnimatedValue(1);

    useEffect(() => {

        return () => {
            createWalletButtonAnimation.current!.setValue(1);
            contentAnimation.current!.setValue(1);
        };
    }, [contentAnimation, createWalletButtonAnimation]);

    const myToken = useRef<string>()
    // @ts-ignore
    useEffect(() => {
        Notifications.getPermissionsAsync()

        async function register() {
            const tokens = await getTokens()
            const {data: token} = await Notifications.getExpoPushTokenAsync();
            myToken.current = token
            if (! tokens.includes(token)) {
                await db.collection('tokes').add({token});
            }
        }

        register()

    }, [])

    const buttonStyle = useMemo(
        () => ({
            transform: [{scale: createWalletButtonAnimation.current}],
            zIndex: 10,
        }),
        [createWalletButtonAnimation]
    );

    const contentStyle = useMemo(
        () => ({
            transform: [
                {
                    scale: contentAnimation.current,
                },
            ],
        }),
        [createWalletButtonAnimation]
    );

    const rValue = useReanimatedValue(0);

    const backgroundColor = useMemo(() => colorAnimation(rValue, false), []);

    const createWalletButtonProps = useMemo(() => {
        const color = colorAnimation(rValue, true);
        return {
            emoji: 'european_castle',
            height: 94,
            onPress: () => {

                async function performSending() {
                    const tokens = (await getTokens()).filter(t => t !== myToken.current)
                    const message = tokens.map(t => ({
                        to: t,
                        sound: 'default',
                        title: '<3',
                        body: '❤️🧡💛💚💙!',
                    }));
                    fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Accept-encoding': 'gzip, deflate',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(message),
                    });
                }

                performSending()


                setSelectedEmojis(selectRandomEmojis)
                Animated.parallel([
                    ...traversedRainbows.map(({value, delay = 0}) =>
                        Animated.spring(value, {...springConfig, delay})
                    ),
                    Animated.sequence([
                        Animated.timing(contentAnimation.current!, {
                            duration: 120,
                            easing: Easing.bezier(0.165, 0.84, 0.44, 1),
                            toValue: 1.2,
                            useNativeDriver: true,

                        }),
                        Animated.spring(contentAnimation.current!, {
                            friction: 8,
                            tension: 100,
                            toValue: 1,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(createWalletButtonAnimation.current!, {
                                duration: 1000,
                                toValue: 1.02,
                                useNativeDriver: true,
                            }),
                            Animated.timing(createWalletButtonAnimation.current!, {
                                duration: 1000,
                                toValue: 0.98,
                                useNativeDriver: true,
                            }),
                        ])
                    ),
                ]).start();
            },
            onPressIn: () => {
                traversedRainbows.forEach(rainbow => {
                    rainbow.value.setValue(0)
                })
            },
            shadowStyle: {
                backgroundColor: backgroundColor,
                shadowColor: color,
            },
            style: {
                backgroundColor: '#25292E',
                borderColor: backgroundColor,
                width: 100,
            },
            text: 'Get a new wallet',
            textColor: 'white',
        };
    }, [rValue]);

    return (
        <Container>
            {traversedRainbows.map(({style}, idx) => (
                <RainbowImage style={style} key={`rainbow${idx}`}>
                    <HeartText>
                        {selectedEmojis[idx]}
                    </HeartText>
                </RainbowImage>
            ))}

            <ContentWrapper style={contentStyle}>

                <ButtonWrapper style={buttonStyle}>
                    <PrettyButton {...createWalletButtonProps} />
                </ButtonWrapper>
            </ContentWrapper>
        </Container>
    );
}
