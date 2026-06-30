import React, { useRef, useState } from 'react';
import { useAccess } from '@umijs/max';
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Tag, Upload, message } from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  InboxOutlined,
  PlayCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  downloadDocument,
  getDocumentList,
  ingestDocument,
  removeDocument,
  uploadDocument,
} from '@/services/kb/document';

const statusMap: Record<string, { text: string; color: string }> = {
  '0': { text: '未解析', color: 'default' },
  '1': { text: '解析中', color: 'processing' },
  '2': { text: '已入库', color: 'success' },
  '3': { text: '失败', color: 'error' },
};

const fileTypeOptions = {
  pdf: { text: 'PDF' },
  docx: { text: 'DOCX' },
  txt: { text: 'TXT' },
  md: { text: 'MD' },
};

const statusOptions = {
  '0': { text: '未解析' },
  '1': { text: '解析中' },
  '2': { text: '已入库' },
  '3': { text: '失败' },
};

const formatSize = (size?: number) => {
  if (!size) return '0 B';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

const handleRemove = async (selectedRows: API.Kb.Document[]) => {
  const hide = message.loading('正在删除');
  try {
    const resp = await removeDocument(selectedRows.map((row) => row.documentId).join(','));
    hide();
    if (resp.code === 200) {
      message.success('删除成功');
      return true;
    }
    message.error(resp.msg);
    return false;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const handleIngest = async (record: API.Kb.Document) => {
  const hide = message.loading('正在解析入库');
  try {
    const resp = await ingestDocument(record.documentId);
    hide();
    if (resp.code === 200) {
      message.success('解析入库成功');
      return true;
    }
    message.error(resp.msg);
    return false;
  } catch (error) {
    hide();
    message.error('解析入库失败，请检查 Python 知识库服务和 embedding 配置');
    return false;
  }
};

const DocumentTableList: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>(null);
  const [selectedRows, setSelectedRows] = useState<API.Kb.Document[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();

  const columns: ProColumns<API.Kb.Document>[] = [
    {
      title: '文件名',
      dataIndex: 'originalName',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'fileType',
      valueType: 'select',
      valueEnum: fileTypeOptions,
      width: 90,
      render: (_, record) => <Tag>{record.fileType?.toUpperCase()}</Tag>,
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      search: false,
      width: 110,
      renderText: (_, record) => formatSize(record.fileSize),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
      width: 110,
      render: (_, record) => {
        const item = statusMap[record.status] || statusMap['0'];
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: '分片数',
      dataIndex: 'chunkCount',
      search: false,
      width: 90,
    },
    {
      title: '向量集合',
      dataIndex: 'collectionName',
      search: false,
      ellipsis: true,
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      search: false,
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      width: 180,
      render: (_, record) => <span>{record.createTime?.toString()}</span>,
      search: {
        transform: (value) => ({
          'params[beginTime]': value[0],
          'params[endTime]': value[1],
        }),
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 230,
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="ingest"
          icon={<PlayCircleOutlined />}
          disabled={record.status === '1'}
          hidden={!access.hasPerms('kb:document:ingest')}
          onClick={async () => {
            const success = await handleIngest(record);
            if (success) actionRef.current?.reload();
          }}
        >
          {record.status === '2' ? '重新解析' : '解析入库'}
        </Button>,
        <Button
          type="link"
          size="small"
          key="download"
          icon={<DownloadOutlined />}
          hidden={!access.hasPerms('kb:document:download')}
          onClick={() => downloadDocument(record.documentId)}
        >
          下载
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="remove"
          hidden={!access.hasPerms('kb:document:remove')}
          onClick={() => {
            Modal.confirm({
              title: '删除文件',
              content: '删除后会同步删除向量库中的分片，确定继续吗？',
              onOk: async () => {
                const success = await handleRemove([record]);
                if (success) actionRef.current?.reload();
              },
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Kb.Document>
        headerTitle="知识库文件"
        actionRef={actionRef}
        rowKey="documentId"
        search={{ labelWidth: 100 }}
        request={(params) =>
          getDocumentList({ ...params } as API.Kb.DocumentListParams).then((res) => ({
            data: res.rows,
            total: res.total,
            success: true,
          }))
        }
        columns={columns}
        rowSelection={{
          onChange: (_, rows) => setSelectedRows(rows),
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="upload"
            icon={<UploadOutlined />}
            hidden={!access.hasPerms('kb:document:upload')}
            onClick={() => {
              setSelectedFile(undefined);
              setUploadOpen(true);
            }}
          >
            上传文件
          </Button>,
          <Button
            danger
            key="remove"
            icon={<DeleteOutlined />}
            hidden={selectedRows.length === 0 || !access.hasPerms('kb:document:remove')}
            onClick={() => {
              Modal.confirm({
                title: '批量删除文件',
                content: '删除后会同步删除向量库中的分片，确定继续吗？',
                onOk: async () => {
                  const success = await handleRemove(selectedRows);
                  if (success) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }
                },
              });
            }}
          >
            删除
          </Button>,
        ]}
      />
      {selectedRows.length > 0 && (
        <FooterToolbar extra={<span>已选择 {selectedRows.length} 项</span>} />
      )}
      <Modal
        title="上传知识库文件"
        open={uploadOpen}
        confirmLoading={uploading}
        okText="上传"
        onCancel={() => {
          setUploadOpen(false);
          setSelectedFile(undefined);
        }}
        onOk={async () => {
          if (!selectedFile) {
            message.warning('请选择文件');
            return;
          }
          setUploading(true);
          try {
            const resp = await uploadDocument(selectedFile);
            if (resp.code === 200) {
              message.success('上传成功');
              setUploadOpen(false);
              setSelectedFile(undefined);
              actionRef.current?.reload();
            } else {
              message.error(resp.msg);
            }
          } finally {
            setUploading(false);
          }
        }}
      >
        <Upload.Dragger
          maxCount={1}
          accept=".pdf,.docx,.txt,.md"
          beforeUpload={(file) => {
            setSelectedFile(file);
            return false;
          }}
          onRemove={() => setSelectedFile(undefined)}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽 PDF、DOCX、TXT、MD 文件到此处</p>
        </Upload.Dragger>
      </Modal>
    </PageContainer>
  );
};

export default DocumentTableList;
