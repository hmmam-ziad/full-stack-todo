
import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import Modal from "./ui/Modal";
import Input from "./Input";
import { ChangeEvent, FormEvent, useState } from "react";
import TextArea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import TodoSekeleton from "./TodoSekeleton";
import { faker } from '@faker-js/faker';



const TodoList = () => {
    const storgekey = "loggedInUser";
    const userDataString = localStorage.getItem(storgekey);
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const jwt = userData?.token?.token;

    const [queryVersion, setQueryVersion] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpenConfirmModal, setisOpenConfirmModal] = useState(false);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);

    const [todoToAdd, setTodoToAdd] = useState({
        title: "",
        description: ""
    });

    const [todoToEdit, setTodoToEdit] = useState<ITodo>({
        id: 0,
        title: "",
        description: ""
    });

    //بيرجع منها دايما اوبجيكت
    const{ isLoading, data} = useAuthenticatedQuery({
        queryKey: ['todoList', `${queryVersion}`], 
        url: '/Account/GetUserProfile', 
        config: {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    });
    // ** Handlers

    const onGeneratTodo = async () => {
        for (let i = 0; i < 100; i++) {
            try {
            await axiosInstance.post(`/Todo/CreateTodo`, {title: faker.word.words(5), description: faker.lorem.paragraph(2)}, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            } catch (error) {
                console.log(error);
            }
                
        }
    };

    const onOpenAddModal = () => {
        setIsOpenAddModal(true);
    }

    const onCloseAddModal = () => {
        setTodoToAdd({
            title: "",
            description: ""
        });
        setIsOpenAddModal(false);
    }

    const onCloseEditModal= () => {
        setTodoToEdit({
            id: 0,
            title: "",
            description: ""
        });
        setIsEditModalOpen(false);
    }

    const onOpenEditModal = (todo: ITodo) => {
        setTodoToEdit(todo);
        setIsEditModalOpen(true);
        // console.log(todo);
    }

    const onChangeHandler = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = evt.target;
        setTodoToEdit({
            ...todoToEdit,
            [name]: value
        })
        
    }

    const onChangeAddTodoHandler = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = evt.target;
        setTodoToAdd({
            ...todoToAdd,
            [name]: value
        })
        
    }

    const closeConfirmModal = () => {
        setTodoToEdit({
            id: 0,
            title: "",
            description: ""
        });
        setisOpenConfirmModal(false);
        
    };
    const openConfirmationModal = (todo: ITodo) => {
        setTodoToEdit(todo);
        setisOpenConfirmModal(true)
    };

    const onRemove = async() => {
        try {
           const res = await axiosInstance.delete(`/Todo/DeleteTodo/${todoToEdit.id}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

             
            if(res.status === 200) {
                closeConfirmModal();
                setQueryVersion(prev => prev + 1);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const submitHandler = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        
        setIsUpdating(true);

        const {title, description} = todoToEdit;
        try {
            const res = await axiosInstance.put(`/Todo/UpdateTodo/${todoToEdit.id}`, {title, description}, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            console.log(res);

            if(res.status === 200) {
                onCloseEditModal();
                setQueryVersion(prev => prev + 1); // Increment query version to refetch data
            }
        } catch (error) {
            console.log(error);
        }finally {
            setIsUpdating(false);
        }
    }

    const submitAddHandler = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        
        setIsUpdating(true);

        const {title, description} = todoToAdd;
        try {
            const res = await axiosInstance.post(`/Todo/CreateTodo`, {title, description}, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            console.log(res);

            if(res.status === 200) {
                onCloseAddModal();
                setQueryVersion(prev => prev + 1);
            }
        } catch (error) {
            console.log(error);
        }finally {
            setIsUpdating(false);
        }
    }

      
    if(isLoading) 
    return <div className="space-y-1 p-3">
        {Array.from({ length: 5 }, (_, index) => <TodoSekeleton key={index} />)}
    </div>
      

    return(
        <div className="space-y-1">
            <div className="w-fit mx-auto my-10">
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400>"></div>
                        <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400>"></div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Button onClick={onOpenAddModal} size={"sm"}>Add Todo</Button>
                        <Button variant={"outline"} onClick={onGeneratTodo} size={"sm"}>Generate Todos</Button>
                    </div>
                )}
            </div>
            
            {
               data.todos.length ? data.todos.map((todo: ITodo)=> (
                        <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
                            <p className="w-full font-semibold">{todo.id} - {todo.title}</p>
                            <div className="flex items-center justify-end w-full space-x-3">
                                <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>Edit</Button>
                                <Button size={"sm"} variant={"danger"} onClick={() => openConfirmationModal(todo)}>Remove</Button>
                            </div>
                        </div>
                    )
                ) :
                <h3>No Todos yet</h3>
            }
            {/*Edit Modal*/}
            <Modal isOpen={isEditModalOpen} closeModal={onCloseEditModal} title="Edit this todo">
                <form className="space-y-3" onSubmit={submitHandler}>
                    <Input name="title" value={todoToEdit.title} onChange={onChangeHandler}/>
                    <TextArea name="description" value={todoToEdit.description} onChange={onChangeHandler} />
                    <div className="flex items-center justify-end space-x-3 mt-4">
                        <Button type="button" size={"sm"} variant={"danger"} onClick={onCloseEditModal}>Cancel</Button>
                        <Button size={"sm"} isLoading={isUpdating}>Save</Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isOpenConfirmModal}
                closeModal={closeConfirmModal}
                title="Are you sure you want to remove this todo from your store ?"
                description="Deleting this todo will remove it permenantly from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
            >
                <div className="flex items-center space-x-3 mt-4">
                <Button variant="danger" onClick={onRemove}>
                    Yes , Remove
                </Button>
                <Button variant="cancel" type="button" onClick={closeConfirmModal}>
                    Cancel
                </Button>
                </div>
            </Modal>

            {/*Add Modal*/}
            <Modal isOpen={isOpenAddModal} closeModal={onCloseAddModal} title="Add New Todo">
                <form className="space-y-3" onSubmit={submitAddHandler}>
                    <Input name="title" value={todoToAdd.title} onChange={onChangeAddTodoHandler}/>
                    <TextArea name="description" value={todoToAdd.description} onChange={onChangeAddTodoHandler} />
                    <div className="flex items-center justify-end space-x-3 mt-4">
                        <Button type="button" size={"sm"} variant={"danger"} onClick={onCloseAddModal}>Cancel</Button>
                        <Button size={"sm"} isLoading={isUpdating}>Save</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default TodoList