import React from 'react';
import { Table } from 'react-bootstrap';

const ProductSpecifications = ({ specifications }) => {
  return (
    <div className="specifications-section">
      <h2 className="h4 mb-3">Thông số kỹ thuật</h2>
      <Table striped bordered>
        <tbody>
          {Object.entries(specifications).map(([key, value]) => (
            <tr key={key}>
              <td className="fw-bold" style={{ width: '200px' }}>
                {key === 'os' ? 'Hệ điều hành' :
                 key === 'screen' ? 'Màn hình' :
                 key === 'camera' ? 'Camera' :
                 key === 'chip' ? 'Chip xử lý' :
                 key === 'ram' ? 'RAM' :
                 key === 'storage' ? 'Bộ nhớ trong' :
                 key === 'battery' ? 'Pin, Sạc' : key}
              </td>
              <td>
                {value.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductSpecifications; 