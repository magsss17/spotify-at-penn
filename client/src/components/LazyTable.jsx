/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Table, Paper, Pagination, Container,
} from '@mantine/core';
import { usePagination } from '@mantine/hooks';

export default function LazyTable({
  route, columns, defaultPageSize,
}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); // 1 indexed
  const [pageSize] = useState(defaultPageSize ?? 10);
  const [numberOfPages, setNumberOfPages] = useState(
    Math.ceil(data.length / pageSize),
  );

  const pagination = usePagination({
    totalItems: data.length,
    pageSize,
    page,
    onPageChange: setPage,
  });

  useEffect(() => {
    fetch(`${route}?page=${page}&page_size=${pageSize}`)
      .then((res) => res.json())
      .then((resJson) => {
        setData(resJson);
      });
  }, [route, page, pageSize]);

  useEffect(() => {
    fetch(`${route}`)
      .then((res) => res.json())
      .then((resJson) => {
        setNumberOfPages(Math.ceil(resJson.length / pageSize));
      });
  }, [pageSize]);

  const defaultRenderCell = (col, row) => <div>{row[col.field]}</div>;

  return (
    <Paper padding="md" mx={10} my={10} shadow={0}>
      <Table>
        <thead>
          <tr>
            {columns.map((col) => <th key={col.headerName}>{col.headerName}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {
                columns.map((col) => (
                  <td key={col.headerName}>
                    {col.renderCell ? col.renderCell(row) : defaultRenderCell(col, row)}
                  </td>
                ))
              }
            </tr>
          ))}
        </tbody>
        <Container align="center">
          <Pagination
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...pagination}
            total={numberOfPages === 0 ? 1 : numberOfPages}
            value={page}
            onChange={setPage}
          />
        </Container>
      </Table>

    </Paper>
  );
}
