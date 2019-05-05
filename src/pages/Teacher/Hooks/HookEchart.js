import React, {useEffect, useState, useRef, useCallback} from 'react';
import {request} from '@pages/Teacher/commen/request';
import TestEchart from '@pages/Teacher/Survey/TestEchart';
import Load from '@components/beijing/Loading';
import NoDataComponent from '@components/beijing/NoData';

function useEventCallback(fn, dependencies) {
    const ref = useRef(() => {
        throw new Error('Cannot call an event handler while rendering.');
    });

    useEffect(() => {
        ref.current = fn;
    }, [fn, ...dependencies]);

    return useCallback(() => {
        const fn = ref.current;
        return fn();
    }, [ref]);
}

export default (props) => {
    const textRef = useRef();
    const [text, updateText] = useState('111');

    const [state, setState] = useState({
        loading: true,
        data: [],
        noData: false
    });

    useEffect(() => {
        textRef.current = text; // 把它写入 ref
    });

    const handleSubmit1 = useEventCallback(() => {
        console.log(text);
    }, [text]);


    const handleSubmit = useCallback(() => {
        const currentText = textRef.current; // 从 ref 读取它
        console.log(currentText);
    }, [textRef]); // 不要像 [text] 那样重新创建 handleSubmit


    // async function fetchComment() {
    //     let res = await request.teacherType4College();
    //
    //     res = [{
    //         name: '测试',
    //         value: '111'
    //     }, {
    //         name: '测试1',
    //         value: '22'
    //     }, {
    //         name: '测试2',
    //         value: '33'
    //     }, {
    //         name: '测试3',
    //         value: '12'
    //     }];
    //
    //     setState({
    //         loading: false,
    //         data: res.length > 0 ? res : [],
    //         noData: res.length > 0 ? false : true
    //     });
    // }

    useEffect(() => {
            async function fetchComment() {
                let res = await request.teacherType4College();

                res = [{
                    name: '测试',
                    value: '111'
                }, {
                    name: '测试1',
                    value: '22'
                }, {
                    name: '测试2',
                    value: '33'
                }, {
                    name: '测试3',
                    value: '12'
                }];

                setState({
                    loading: false,
                    data: res.length > 0 ? res : [],
                    noData: res.length > 0 ? false : true
                });
            }

            fetchComment();
        }, [JSON.stringify(state.data)]
    );


    return (
        <React.Fragment>
            <div onClick={handleSubmit}>饿3213123</div>
            {
                state.data.length > 0 && !state.loading && !state.noData &&
                <TestEchart {...props} data={state.data}></TestEchart>
            }
            {
                state.loading && <Load></Load>
            }
            {
                state.noData && <NoDataComponent></NoDataComponent>
            }
        </React.Fragment>
    );
}
