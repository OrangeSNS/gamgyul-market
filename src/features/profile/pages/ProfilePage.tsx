import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Button from '@shared/components/Button'
import PostCard from '@shared/components/PostCard'
import ProductCard from '@shared/components/ProductCard'
import Spinner from '@shared/components/Spinner'
import Modal from '@shared/components/Modal'
import BottomSheet from '@shared/components/BottomSheet'
import TopBar from '@app/layouts/TopBar'
import { useAuth } from '@app/providers/AuthProvider'
import { User, Post, Product } from '@shared/types'
import { ROUTES } from '@shared/constants'
import { parsePostImages } from '@shared/utils'
import {
  getProfile,
  followUser,
  unfollowUser,
  getUserPosts,
  getProducts,
  deleteProduct,
} from '../api'

type ViewMode = 'list' | 'grid'

export default function ProfilePage() {
  const { accountName } = useParams<{ accountName: string }>()
  const navigate = useNavigate()
  const { user: me, logout } = useAuth()

  const isMe = me?.accountname === accountName

  const [profile, setProfile] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Bottom sheet / modal state
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [showProductSheet, setShowProductSheet] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    if (!accountName) return
    setLoading(true)
    Promise.all([
      getProfile(accountName),
      getUserPosts(accountName),
      getProducts(accountName),
    ])
      .then(([{ profile }, { post }, { product }]) => {
        setProfile(profile)
        setPosts(post)
        setProducts(product)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [accountName])

  const handleFollowToggle = async () => {
    if (!profile) return
    try {
      if (profile.isfollow) {
        const { profile: updated } = await unfollowUser(profile.accountname)
        setProfile(updated)
      } else {
        const { profile: updated } = await followUser(profile.accountname)
        setProfile(updated)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleProductClick = (product: Product) => {
    if (!isMe) {
      window.open(product.link, '_blank')
      return
    }
    setSelectedProduct(product)
    setShowProductSheet(true)
  }

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return
    try {
      await deleteProduct(deleteTarget)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget))
    } catch (err) {
      console.error(err)
    }
    setDeleteTarget(null)
    setShowDeleteModal(false)
  }

  // Album view: posts with images only
  const albumPosts = posts.filter((p) => parsePostImages(p.image).length > 0)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center py-20 text-sm text-gray-500">
        프로필을 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <TopBar
        showBack={!isMe}
        title={isMe ? '' : ''}
        rightSlot={
          <button
            onClick={() => setShowBottomSheet(true)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        }
      />

      {/* Profile header */}
      <div className="px-6 pt-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          {/* Stats */}
          <button
            onClick={() => navigate(ROUTES.PROFILE_FOLLOWERS(profile.accountname))}
            className="flex flex-col items-center gap-0.5"
          >
            <span className="text-lg font-bold text-gray-900">{profile.followerCount}</span>
            <span className="text-xs text-gray-500">팔로워</span>
          </button>

          {/* Avatar */}
          <Avatar src={profile.image} alt={profile.username} size="xl" />

          {/* Stats */}
          <button
            onClick={() => navigate(ROUTES.PROFILE_FOLLOWING(profile.accountname))}
            className="flex flex-col items-center gap-0.5"
          >
            <span className="text-lg font-bold text-gray-900">{profile.followingCount}</span>
            <span className="text-xs text-gray-500">팔로잉</span>
          </button>
        </div>

        {/* Name & intro */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">{profile.username}</h2>
          <p className="text-sm text-gray-400">@{profile.accountname}</p>
          {profile.intro && (
            <p className="text-sm text-gray-600 mt-1">{profile.intro}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-center">
          {isMe ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.PROFILE_EDIT)}
              >
                프로필 수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.PRODUCT_NEW)}
              >
                상품 등록
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={profile.isfollow ? 'outline' : 'primary'}
                size="sm"
                onClick={handleFollowToggle}
              >
                {profile.isfollow ? '언팔로우' : '팔로우'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.CHAT_ROOM(profile.accountname))}
              >
                채팅하기
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Products section */}
      {products.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">판매 중인 상품</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-28">
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts toggle */}
      <div className="border-t border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setViewMode('list')}
            className={[
              'flex-1 flex items-center justify-center py-3 border-b-2 transition-colors',
              viewMode === 'list'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-400',
            ].join(' ')}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={[
              'flex-1 flex items-center justify-center py-3 border-b-2 transition-colors',
              viewMode === 'grid'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-400',
            ].join(' ')}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>

        {viewMode === 'list' ? (
          posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} isMyPost={isMe} />)
          ) : (
            <p className="text-center text-sm text-gray-400 py-12">게시글이 없습니다.</p>
          )
        ) : albumPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-0.5">
            {albumPosts.map((post) => {
              const images = parsePostImages(post.image)
              return (
                <button
                  key={post.id}
                  onClick={() => navigate(ROUTES.POST_DETAIL(post.id))}
                  className="aspect-square overflow-hidden bg-gray-100"
                >
                  <img
                    src={images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400 py-12">
            이미지가 있는 게시글이 없습니다.
          </p>
        )}
      </div>

      {/* Profile bottom sheet */}
      <BottomSheet
        open={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        items={
          isMe
            ? [
                { label: '설정 및 개인정보', onClick: () => navigate(ROUTES.PROFILE_EDIT) },
                {
                  label: '로그아웃',
                  onClick: () => setShowLogoutModal(true),
                  danger: true,
                },
              ]
            : [{ label: '신고하기', onClick: () => {}, danger: true }]
        }
      />

      {/* Product bottom sheet */}
      <BottomSheet
        open={showProductSheet}
        onClose={() => setShowProductSheet(false)}
        items={[
          {
            label: '삭제',
            danger: true,
            onClick: () => {
              setDeleteTarget(selectedProduct?.id ?? null)
              setShowDeleteModal(true)
            },
          },
          {
            label: '수정',
            onClick: () => {
              if (selectedProduct) {
                navigate(ROUTES.PRODUCT_EDIT(selectedProduct.id))
              }
            },
          },
          {
            label: '웹사이트에서 보기',
            onClick: () => {
              if (selectedProduct?.link) {
                window.open(selectedProduct.link, '_blank')
              }
            },
          },
        ]}
      />

      {/* Logout modal */}
      <Modal
        open={showLogoutModal}
        message="로그아웃 하시겠어요?"
        confirmLabel="로그아웃"
        onConfirm={() => {
          logout()
          navigate(ROUTES.LOGIN, { replace: true })
        }}
        onCancel={() => setShowLogoutModal(false)}
        destructive
      />

      {/* Delete product modal */}
      <Modal
        open={showDeleteModal}
        message="상품을 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={handleDeleteProduct}
        onCancel={() => {
          setShowDeleteModal(false)
          setDeleteTarget(null)
        }}
        destructive
      />
    </div>
  )
}
