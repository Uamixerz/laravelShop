import { useEffect, useState } from "react";
import { ICategoryItem, ICategoryResponse } from "./types";
import axios from "axios";
import { Link, useParams, useSearchParams } from "react-router-dom";
import classNames from "classnames";
import { useMediaQuery } from "@mui/material";

import { KeyboardArrowLeft, KeyboardArrowRight, LastPage, FirstPage } from "@mui/icons-material";
import { blue, green } from "@mui/material/colors";
import { APP_ENV } from "../../env";
import http from "../../http";
import { Button, Modal } from "react-bootstrap";

let pagination: any;
const HomePage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [searchParams, SetSearchParams] = useSearchParams();
  const [search, SetSearch] = useState({
    page: searchParams.get("page") || 1,
  });
  const isScreenSmall = useMediaQuery("(max-width:770px)");
  const isScreenSmall395 = !useMediaQuery("(max-width:395px)");
  const sizeButons = 300;

  const [deleteId, SetDeleteID] = useState(-1);

  const ShowModal=(id:any)=>{
    SetDeleteID(id);
    handleShow();
  }

  if (isScreenSmall)
    console.log("yeah < 770px")
  else
    console.log("nope > 770px")
  const [category, setCategory] = useState<ICategoryResponse>(
    {
      data: [],
      total: 0,
      current_page: 1,
      last_page: 0
    }
  );
  const { data, last_page, current_page } = category;
  const buttons = [];

  for (let i = 1; i <= last_page; i++) {
    buttons.push(i);
  }

  if (!isScreenSmall) {
    pagination =
      (
        <ul className="pagination justify-content-center">
          {/* Виводимо перші 7 елементів */}
          {current_page < 6 &&
            buttons.slice(0, 7).map((page) => (
              <li className={classNames("page-item", { "active": page == current_page })}>
                <Link className="page-link" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page}>
                  {page}
                </Link>
              </li>))
          }
          {/* Виводимо тільки 1 елемент */}
          {current_page >= 6 &&
            buttons.slice(0, 1).map((page) => (
              <li className={classNames("page-item", { "active": page == current_page })}>
                <Link className="page-link" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page}>
                  {page}
                </Link>
              </li>))
          }
          {/* 1 елемент назад, коли два спереді два ззаду */}
          {current_page >= 6 && current_page >= 6 && current_page < buttons.length - 4 &&
            buttons.slice(current_page - 4, current_page - 3).map((page) => (
              <li className={classNames("page-item", { "active": page == current_page })}>
                <Link className="page-link" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page}>
                  ...
                </Link>
              </li>))
          }
          {/* 1 елемент назад */}
          {current_page >= buttons.length - 4 &&
            buttons.slice(buttons.length - 8, buttons.length - 7).map((page) => (
              <li className={classNames("page-item", { "active": page == current_page })}>
                <Link className="page-link" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page}>
                  ...
                </Link>
              </li>))
          }
          {/* Поточний елемент та два по бокам */}
          {current_page >= 6 && current_page < buttons.length - 4 &&
            buttons.slice(current_page - 3, current_page + 2).map((page) => (
              <li className={classNames("page-item", { "active": page == current_page })}>
                <Link className="page-link" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page}>
                  {page}
                </Link>
              </li>))
          }

          {/* Вивід елементів в кінці, щоб було 9 Li */}
          {current_page >= 6 && current_page >= buttons.length - 4 &&
            buttons.slice(buttons.length - 7, buttons.length).map((page) => (
              <li className={classNames("page-item", { "active": page == current_page })}>
                <Link className="page-link" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page}>
                  {page}
                </Link>
              </li>))
          }

          {/* 1 елемент вперед, коли 2 спереді 2 ззаду */}
          {current_page < buttons.length - 4 && current_page >= 6 && current_page < buttons.length - 4 &&
            buttons.slice(current_page + 2, current_page + 3).map((page) => (
              <li className={classNames("page-item", { "active": page == current_page })}>
                <Link className="page-link" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page}>
                  ...
                </Link>
              </li>))
          }
          {/* 1 елемент вперед, до 6 ел. */}
          {current_page < buttons.length - 4 && current_page < 6 &&
            buttons.slice(7, 8).map((page) => (
              <li className={classNames("page-item", { "active": page == current_page })}>
                <Link className="page-link" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page}>
                  ...
                </Link>
              </li>))
          }
          {/* останій елемент */}
          {current_page < buttons.length - 4 &&
            buttons.slice(buttons.length - 1, buttons.length).map((page) => (
              <li className={classNames("page-item", { "active": page == current_page })}>
                <Link className="page-link" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page}>
                  {page}
                </Link>
              </li>))
          }

        </ul>
      );
  } else {
    pagination = (
      <>

        <div className="row">
          {/* For Disabled */}
          {/*  Перші кнопкі */}
          {current_page == 1 &&
            (
              <>
                <div className="col p-0">
                  <div className="position-relative ">
                    <div className="position-absolute">
                      <KeyboardArrowLeft className="" sx={{ fontSize: 65, backgroundColor: blue[100], color: blue[200], borderRadius: '25%' }}></KeyboardArrowLeft>
                    </div>
                  </div>
                </div>
                <div className="col p-0" >
                  <div className="position-relative">
                    <div className="position-absolute">
                      <FirstPage className="end-0" sx={{ fontSize: 65, backgroundColor: blue[100], color: blue[200], borderRadius: '25%' }}></FirstPage>
                    </div>
                  </div>
                </div>
              </>
            )
          }


          {/* На Першу сторінку */}
          {
            current_page != 1 &&
            buttons.slice(0, 1).map((page) => (
              <div className="col p-0">
                <div className="position-relative ">
                  <div className="position-absolute">
                    <FirstPage className="" sx={{ fontSize: 65, backgroundColor: blue[500], color: blue[900], borderRadius: '25%' }}></FirstPage>
                    <Link className="position-absolute top-0 page-link d-block w-100 h-100" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page} >/</Link>
                  </div>
                </div>
              </div>
            ))
          }
          {/* Крок назад */}
          {current_page != 1 &&
            buttons.slice(current_page - 2, current_page - 1).map((page) => (
              <div className="col p-0">
                <div className="position-relative ">
                  <div className="position-absolute">
                    <KeyboardArrowLeft className="" sx={{ fontSize: 65, backgroundColor: blue[500], color: blue[900], borderRadius: '25%' }}></KeyboardArrowLeft>
                    <Link className="position-absolute top-0 page-link d-block w-100 h-100" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page} >/</Link>
                  </div>
                </div>
              </div>
            ))
          }

          <div className="col text-center">
            {current_page}/{buttons.length}
          </div>

          {/* Крок вперед */}
          {current_page != buttons.length &&
            buttons.slice(current_page, current_page + 1).map((page) => (
              <div className="col p-0">
                <div className="position-relative ">
                  <div className="position-absolute">
                    <KeyboardArrowRight className="" sx={{ fontSize: 65, backgroundColor: blue[500], color: blue[900], borderRadius: '25%' }}></KeyboardArrowRight>
                    <Link className="position-absolute top-0 page-link d-block w-100 h-100" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page} >/</Link>
                  </div>
                </div>
              </div>
            ))
          }
          {/* на останю сторінку */}
          {
            current_page != buttons.length &&
            buttons.slice(buttons.length - 1, buttons.length).map((page) => (
              <div className="col p-0" >
                <div className="position-relative justify-content-end">
                  <div className="position-absolute end-0">
                    <LastPage className="end-0" sx={{ fontSize: 65, backgroundColor: blue[500], color: blue[900], borderRadius: '25%' }}></LastPage>
                    <Link className="end-0 position-absolute m-0 top-0 page-link d-block w-100 h-100" onClick={() => SetSearch({ ...search, page })} to={"?page=" + page} >/</Link>
                  </div>

                </div>
              </div>
            ))
          }

          {/* for Disabled */}
          {/*  Останні кнопкі */}
          {current_page == buttons.length &&
            (
              <>
                <div className="col p-0">
                  <div className="position-relative ">
                    <div className="position-absolute">
                      <KeyboardArrowRight className="" sx={{ fontSize: 65, backgroundColor: blue[100], color: blue[200], borderRadius: '25%' }}></KeyboardArrowRight>
                    </div>
                  </div>
                </div>
                <div className="col p-0" >
                  <div className="position-relative justify-content-end">
                    <div className="position-absolute end-0">
                      <LastPage className="end-0" sx={{ fontSize: 65, backgroundColor: blue[100], color: blue[200], borderRadius: '25%' }}></LastPage>
                    </div>
                  </div>
                </div>
              </>
            )
          }


        </div>
      </>
    )
  }

  

  useEffect(() => {
    const result = http.get<ICategoryResponse>(`api/category`, { params: search }).then(resp => {
      //console.log("axios result", resp);
      setCategory(resp.data);
    }
    )
      .catch(bad => {
        console.log("bad request", bad)
      }
      );
  }, [search]);

  const Delete = (id: any) => {
    console.log(id);
    const result = http.delete<ICategoryResponse>(`api/category/delete/${id}`).then(resp => {
      const result = http.get<ICategoryResponse>(`api/category`, { params: search }).then(resp => {
        //console.log("axios result", resp);
        setCategory(resp.data);
      }
      )
        .catch(bad => {
          console.log("bad request", bad)
        }
        );
    }
    )
      .catch(bad => {
        console.log("bad request", bad)
      }
      );
    handleClose();
  }
  const dataView = data.map(category =>
    <tr key={category.id}>
      <th><img src={`${APP_ENV.BASE_URL}storage/uploads/${category.image}`} alt="Фотка" width={50} /></th>
      <td>{category.name}</td>
      <td>{category.description}</td>
      <td><button onClick={() => ShowModal(category.id)}>Delete</button></td>
      <td><Link to={`/categories/edit?id=${category.id}`}>Edit</Link></td>
    </tr >
  );
  return (
    <>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Видалення</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ви справді хочете видалити категорію ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={()=>Delete(deleteId)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <h1 className="text-center">Список категорій</h1>
      <Link to="/categories/create" className="btn btn-success">Додати</Link>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Фото</th>
            <th scope="col">Назва</th>
            <th scope="col">Опис</th>
          </tr>
        </thead>
        <tbody>
          {dataView}

        </tbody>
      </table>
      <nav aria-label="Page navigation example">

        {pagination}

      </nav>
    </>
  );
};

export default HomePage;