import { ChangeEvent, useState } from "react";
import Paginator from "../components/ui/Pagenator";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";
import { Button } from "@headlessui/react";
import { faker } from '@faker-js/faker';


const TodosPage = () => {
  const storgekey = "loggedInUser";
    const userDataString = localStorage.getItem(storgekey);
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const jwt = userData?.token?.token;

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const{ isLoading, data, isFetching} = useAuthenticatedQuery({
        queryKey: ['paginatedTodos', `${page}`], 
        url: `/Todo/Todos?pageSize=${pageSize}&page=${page}`, 
        config: {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    });

  // Handlers
  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };
  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };

  const onGenerateTodos = async () => {
    //100 record
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

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <>
      <div className="flex items-center justify-between space-x-2">
        <Button
          onClick={onGenerateTodos}
          title="Generate 100 records"
        >
          Generate todos
        </Button>
        <div className="flex items-center justify-between space-x-2 text-md">
          
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={pageSize}
            onChange={onChangePageSize}
          >
            <option disabled>Page Size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="my-20 space-y-6">
            <div>
            {data.items.length ? data.items.map((todo: ITodo)=> (
                        <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
                            <h3 className="w-full font-semibold">{todo.id} - {todo.title}</h3>
                            
                        </div>
                    )
                ) :
                <h3>No Todos yet</h3>}
            </div>
            <Paginator page={page} isLoading={isLoading || isFetching} pageCount={data.totalPages} total={data.totalCount} onClickPrev={onClickPrev} onClickNext={onClickNext}/>
        
      </div>
    </>
  );
};


export default TodosPage